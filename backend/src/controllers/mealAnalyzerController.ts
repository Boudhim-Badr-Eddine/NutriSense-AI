import { promises as fs } from "fs";
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { config } from "../config/env";
import { Food } from "../models/Food";
import { Supplement } from "../models/Supplement";
import { logger } from "../utils/logger";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ANALYZE_MEAL_PROMPT = `You are a nutrition expert AI for NutriSense AI platform.
Analyze this food photo and:
1. Identify ALL foods and ingredients you can see
2. Estimate the portion sizes (small/medium/large/extra-large)
3. For each identified food provide:
   - Estimated grams in this portion
   - Calories
   - Protein (g)
   - Carbs (g)
   - Fats (g)
4. Provide TOTALS for the entire meal
5. Rate this meal: 'High Protein' | 'Balanced' | 'High Carb' | 'High Fat' | 'Low Calorie'

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "foods": [
    {
      "name": "string",
      "estimatedGrams": 0,
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fats": 0,
      "confidence": "high"
    }
  ],
  "totals": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "mealRating": "string",
  "portionAssessment": "string"
}`;

type FoodConfidence = "high" | "medium" | "low";

interface IdentifiedFood {
  name: string;
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: FoodConfidence;
}

interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealPhotoAnalysis {
  foods: IdentifiedFood[];
  totals: MealTotals;
  mealRating: string;
  portionAssessment: string;
}

interface FoodDbMatch {
  _id: unknown;
  name: string;
  slug: string;
}

interface MealMulterRequest extends Request {
  file?: Express.Multer.File;
}

const geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
const geminiModel = geminiClient.getGenerativeModel(
  { model: config.gemini.model },
  { apiVersion: config.gemini.apiVersion },
);

const roundToOne = (value: number): number => {
  return Math.round(value * 10) / 10;
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const stripCodeFence = (value: string): string => {
  const withoutFence = value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return withoutFence;
  }

  return withoutFence.slice(firstBrace, lastBrace + 1);
};

const normalizeSingleQuotedJson = (value: string): string => {
  return value
    .replace(/([{,]\s*)'([^']+?)'\s*:/g, "$1\"$2\":")
    .replace(/:\s*'([^']*?)'/g, ': "$1"');
};

const parseMealAnalysisResponse = (rawText: string): MealPhotoAnalysis => {
  const candidate = stripCodeFence(rawText);

  try {
    return JSON.parse(candidate) as MealPhotoAnalysis;
  } catch {
    try {
      const normalized = normalizeSingleQuotedJson(candidate);
      return JSON.parse(normalized) as MealPhotoAnalysis;
    } catch {
      throw new Error("JSON_PARSE_FAILED");
    }
  }
};

const isMealAnalysisShape = (analysis: MealPhotoAnalysis): boolean => {
  return (
    Array.isArray(analysis.foods) &&
    typeof analysis.mealRating === "string" &&
    typeof analysis.portionAssessment === "string" &&
    typeof analysis.totals?.calories === "number" &&
    typeof analysis.totals?.protein === "number" &&
    typeof analysis.totals?.carbs === "number" &&
    typeof analysis.totals?.fats === "number"
  );
};

const computeMacroPercentages = (totals: MealTotals) => {
  const proteinCalories = totals.protein * 4;
  const carbsCalories = totals.carbs * 4;
  const fatsCalories = totals.fats * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatsCalories;

  if (totalMacroCalories <= 0) {
    return { protein: 0, carbs: 0, fats: 0 };
  }

  return {
    protein: roundToOne((proteinCalories / totalMacroCalories) * 100),
    carbs: roundToOne((carbsCalories / totalMacroCalories) * 100),
    fats: roundToOne((fatsCalories / totalMacroCalories) * 100),
  };
};

const extractRecommendationKeywords = (text: string): string[] => {
  const STOPWORDS = new Set([
    "the",
    "and",
    "for",
    "with",
    "your",
    "meal",
    "this",
    "that",
    "from",
    "into",
    "about",
    "have",
    "high",
    "low",
    "balanced",
    "calorie",
    "protein",
    "carb",
    "fat",
    "supplement",
    "supplements",
  ]);

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9-]+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 2 && !STOPWORDS.has(word)),
    ),
  ).slice(0, 10);
};

const cleanupUploadedFile = async (file?: Express.Multer.File): Promise<void> => {
  if (!file?.path) {
    return;
  }

  try {
    await fs.unlink(file.path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.warn(`Failed to cleanup uploaded file at ${file.path}: ${message}`);
  }
};

/**
 * Analyze a meal photo with Gemini Vision and enrich with NutriSense database matches.
 * WHY: Supports image-based nutrition estimation and practical supplement guidance.
 */
export const analyzeMealPhoto = async (
  req: MealMulterRequest,
  res: Response,
): Promise<void> => {
  const uploadedFile = req.file;

  try {
    if (!uploadedFile) {
      res.status(400).json({
        success: false,
        error: "Meal photo is required",
      });
      return;
    }

    if (!SUPPORTED_MIME_TYPES.has(uploadedFile.mimetype.toLowerCase())) {
      res.status(400).json({
        success: false,
        error: "Unsupported image format. Use jpg, jpeg, png, or webp",
      });
      return;
    }

    if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
      res.status(400).json({
        success: false,
        error: "Image must be 5MB or smaller",
      });
      return;
    }

    const buffer = uploadedFile.buffer?.length
      ? uploadedFile.buffer
      : uploadedFile.path
        ? await fs.readFile(uploadedFile.path)
        : null;

    if (!buffer) {
      res.status(400).json({
        success: false,
        error: "Could not process uploaded image",
      });
      return;
    }

    const imageBase64 = buffer.toString("base64");

    const visionResult = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: ANALYZE_MEAL_PROMPT },
            {
              inlineData: {
                mimeType: uploadedFile.mimetype,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500,
      },
    });

    const visionText = visionResult.response.text().trim();
    let analysis: MealPhotoAnalysis;

    try {
      analysis = parseMealAnalysisResponse(visionText);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "JSON_PARSE_FAILED") {
        res.status(422).json({
          success: false,
          error: "Analysis failed, please try with a clearer photo",
        });
        return;
      }
      throw error;
    }

    if (!isMealAnalysisShape(analysis) || analysis.foods.length === 0) {
      res.status(422).json({
        success: false,
        error: "Could not identify food in image",
      });
      return;
    }

    const foodsWithMatches = await Promise.all(
      analysis.foods.map(async (food) => {
        const escapedName = escapeRegex(food.name.trim());
        const foodMatch = (await Food.findOne({
          name: { $regex: escapedName, $options: "i" },
        })
          .select("_id name slug")
          .lean()
          .exec()) as FoodDbMatch | null;

        if (!foodMatch) {
          return {
            ...food,
            hasDetailPage: false,
          };
        }

        return {
          ...food,
          dbMatch: {
            _id: foodMatch._id,
            name: foodMatch.name,
            slug: foodMatch.slug,
          },
          hasDetailPage: true,
        };
      }),
    );

    const supplementCandidates = await Supplement.find({})
      .select("name")
      .lean()
      .exec();
    const supplementNames = supplementCandidates.map((item) => item.name).slice(0, 120);

    const recommendationPrompt = `Based on this meal analysis: ${JSON.stringify(analysis.totals)}.
The meal is ${analysis.mealRating}.
From the NutriSense AI supplement database, suggest 2-3 supplements that would
complement this meal or fill its nutritional gaps.
Consider: ${supplementNames.join(", ")}.
Respond in plain text, max 80 words, practical advice only.`;

    const recommendationResult = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: recommendationPrompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 180,
      },
    });

    const aiRecommendation = recommendationResult.response.text().trim();

    const recommendationText = aiRecommendation.toLowerCase();
    const directMatchedNames = supplementNames.filter((name) =>
      recommendationText.includes(name.toLowerCase()),
    );
    const keywords = extractRecommendationKeywords(aiRecommendation);

    const recommendationRegexParts = [
      ...directMatchedNames.map(escapeRegex),
      ...keywords.map(escapeRegex),
    ];

    const recommendedSupplements = recommendationRegexParts.length
      ? await Supplement.find({
          name: { $regex: recommendationRegexParts.join("|"), $options: "i" },
        })
          .select("_id name slug category dosage timing goals")
          .limit(6)
          .lean()
          .exec()
      : [];

    res.status(200).json({
      success: true,
      data: {
        foods: foodsWithMatches,
        totals: analysis.totals,
        macroPercentages: computeMacroPercentages(analysis.totals),
        mealRating: analysis.mealRating,
        portionAssessment: analysis.portionAssessment,
        aiRecommendation,
        recommendedSupplements,
        disclaimer:
          "Nutritional values are AI estimates and may vary. Not a substitute for professional dietary advice.",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("analyzeMealPhoto failed", message);

    res.status(500).json({
      success: false,
      error: "Failed to analyze meal photo",
    });
  } finally {
    await cleanupUploadedFile(uploadedFile);
  }
};