import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Types } from "mongoose";

import { config } from "../config/env";
import COMPATIBILITY_RULES, {
  CompatibilityRule,
} from "../data/stackCompatibility";
import { Supplement, SupplementDocument } from "../models/Supplement";
import { User } from "../models/User";
import { logger } from "../utils/logger";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: "user" | "admin";
  };
}

interface AnalyzeStackBody {
  supplementIds?: string[];
  userGoal?: string;
}

interface SaveStackBody {
  supplementIds?: string[];
  stackName?: string;
  userGoal?: string;
}

interface SavedStack {
  id: string;
  stackName: string;
  userGoal: string;
  supplementIds: string[];
  createdAt: string;
}

interface TimingSchedule {
  morning: string[];
  preWorkout: string[];
  postWorkout: string[];
  withMeals: string[];
  beforeBed: string[];
}

const geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
const geminiModel = geminiClient.getGenerativeModel(
  { model: config.gemini.model },
  { apiVersion: config.gemini.apiVersion },
);

const clampScore = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

const getStackRating = (
  score: number,
): "Excellent" | "Good" | "Fair" | "Poor" => {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Fair";
  }

  return "Poor";
};

const normalizeTiming = (timing: string): keyof TimingSchedule => {
  const value = timing.toLowerCase();

  if (value.includes("pre") && value.includes("workout")) {
    return "preWorkout";
  }

  if (value.includes("post") && value.includes("workout")) {
    return "postWorkout";
  }

  if (
    value.includes("bed") ||
    value.includes("night") ||
    value.includes("sleep")
  ) {
    return "beforeBed";
  }

  if (
    value.includes("meal") ||
    value.includes("food") ||
    value.includes("breakfast") ||
    value.includes("lunch") ||
    value.includes("dinner")
  ) {
    return "withMeals";
  }

  if (value.includes("morning") || value.includes("am")) {
    return "morning";
  }

  return "withMeals";
};

const buildTimingSchedule = (supplements: SupplementDocument[]): TimingSchedule => {
  const schedule: TimingSchedule = {
    morning: [],
    preWorkout: [],
    postWorkout: [],
    withMeals: [],
    beforeBed: [],
  };

  supplements.forEach((supplement) => {
    const bucket = normalizeTiming(supplement.timing ?? "");
    schedule[bucket].push(supplement.name);
  });

  return schedule;
};

const findRuleForPair = (
  firstName: string,
  secondName: string,
): CompatibilityRule[] => {
  const first = firstName.toLowerCase();
  const second = secondName.toLowerCase();

  return COMPATIBILITY_RULES.filter((rule) => {
    const [keywordA, keywordB] = rule.supplements;
    const a = keywordA.toLowerCase();
    const b = keywordB.toLowerCase();

    const directMatch = first.includes(a) && second.includes(b);
    const inverseMatch = first.includes(b) && second.includes(a);

    return directMatch || inverseMatch;
  });
};

const dedupeRules = (rules: CompatibilityRule[]): CompatibilityRule[] => {
  const seen = new Set<string>();

  return rules.filter((rule) => {
    const key = `${rule.type}:${rule.title}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const buildGoalAwarePrompt = (
  supplementNamesAndPurposes: string,
  userGoal: string,
  findings: string,
  score: number,
): string => {
  return `You are an expert sports nutritionist for NutriSense AI.
Analyze this supplement stack: ${supplementNamesAndPurposes}.
User goal: ${userGoal || "general fitness"}.
Compatibility findings: ${findings}.
Stack score: ${score}/100.

Write a professional stack analysis (max 200 words) covering:
1. Overall assessment of this stack for the stated goal
2. The most important synergy benefit
3. Any safety considerations
4. One specific optimization tip

Be direct, practical, and encouraging. No markdown, plain text only.`;
};

const generateAiAnalysis = async (prompt: string): Promise<string> => {
  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 320,
        topK: 40,
        topP: 0.95,
      },
    });

    const response = result.response.text().trim();
    if (!response) {
      return "This stack is generally suitable, but monitor your response and adjust dosages based on tolerance and progress.";
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Gemini stack analysis failed", message);
    return "This stack shows useful potential for your goal. Focus on consistency, avoid overlapping stimulants or minerals at the same time, and review the timing plan to improve results safely.";
  }
};

const ensureValidSupplementIds = (ids: string[]): string | null => {
  if (ids.length < 2 || ids.length > 6) {
    return "supplementIds must contain between 2 and 6 items";
  }

  const hasInvalidId = ids.some((id) => !Types.ObjectId.isValid(id));
  if (hasInvalidId) {
    return "One or more supplementIds are invalid MongoDB ObjectIds";
  }

  return null;
};

/**
 * Analyze supplement stack compatibility, timing, and AI guidance.
 * WHY: Powers the Stack Builder feature with deterministic rules + AI summary.
 */
export const analyzeStack = async (
  req: Request<unknown, unknown, AnalyzeStackBody>,
  res: Response,
): Promise<void> => {
  try {
    const supplementIds = req.body.supplementIds ?? [];
    const userGoal = req.body.userGoal?.trim() ?? "general fitness";

    if (!Array.isArray(supplementIds)) {
      res.status(400).json({
        success: false,
        error: "supplementIds must be an array",
      });
      return;
    }

    const validationError = ensureValidSupplementIds(supplementIds);
    if (validationError) {
      res.status(400).json({ success: false, error: validationError });
      return;
    }

    const objectIds = supplementIds.map((id) => new Types.ObjectId(id));

    const supplements = await Supplement.find({ _id: { $in: objectIds } }).exec();

    if (supplements.length !== supplementIds.length) {
      res.status(404).json({
        success: false,
        error: "Some supplements were not found",
      });
      return;
    }

    const matchedRules: CompatibilityRule[] = [];

    for (let i = 0; i < supplements.length; i += 1) {
      for (let j = i + 1; j < supplements.length; j += 1) {
        const first = supplements[i];
        const second = supplements[j];
        matchedRules.push(...findRuleForPair(first.name, second.name));
      }
    }

    const uniqueRules = dedupeRules(matchedRules);
    const synergies = uniqueRules.filter((rule) => rule.type === "synergy");
    const cautions = uniqueRules.filter((rule) => rule.type === "caution");
    const avoids = uniqueRules.filter((rule) => rule.type === "avoid");

    const synergyBonus = Math.min(synergies.length * 10, 30);
    const cautionPenalty = cautions.length * 10;
    const avoidPenalty = avoids.length * 25;

    const stackScore = clampScore(70 + synergyBonus - cautionPenalty - avoidPenalty);
    const stackRating = getStackRating(stackScore);
    const timingSchedule = buildTimingSchedule(supplements);

    const supplementSummaries = supplements
      .map((supplement) => {
        const purpose = supplement.benefits?.[0] ?? supplement.category;
        return `${supplement.name} (${purpose})`;
      })
      .join(", ");

    const findingText = [
      ...synergies.map((rule) => `Synergy: ${rule.title}`),
      ...cautions.map((rule) => `Caution: ${rule.title}`),
      ...avoids.map((rule) => `Avoid: ${rule.title}`),
    ].join("; ");

    const aiPrompt = buildGoalAwarePrompt(
      supplementSummaries,
      userGoal,
      findingText || "No specific interactions found",
      stackScore,
    );
    const aiAnalysis = await generateAiAnalysis(aiPrompt);

    res.status(200).json({
      success: true,
      data: {
        supplements: supplements.map((supplement) => ({
          _id: supplement._id,
          name: supplement.name,
          category: supplement.category,
          dosage: supplement.dosage,
          timing: supplement.timing,
        })),
        compatibilityReport: {
          synergies,
          cautions,
          avoids,
        },
        stackScore,
        stackRating,
        timingSchedule,
        aiAnalysis,
        disclaimer:
          "Always consult a healthcare professional before starting a supplement regimen.",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("analyzeStack failed", message);
    res.status(500).json({
      success: false,
      error: "Failed to analyze stack",
    });
  }
};

/**
 * Get saved stacks from authenticated user profile.
 * WHY: Allows users to revisit previously built stacks quickly.
 */
export const getSavedStacks = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const userProfile = await User.collection.findOne(
      { _id: new Types.ObjectId(userId) },
      { projection: { savedStacks: 1 } },
    );

    const stacks = (userProfile?.savedStacks as SavedStack[] | undefined) ?? [];

    res.status(200).json({
      success: true,
      data: stacks,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("getSavedStacks failed", message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch saved stacks",
    });
  }
};

/**
 * Save a supplement stack to authenticated user's profile.
 * WHY: Supports persistence of user-created stacks for future reuse.
 */
export const saveStack = async (
  req: AuthenticatedRequest & Request<unknown, unknown, SaveStackBody>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const supplementIds = req.body.supplementIds ?? [];
    const stackName = req.body.stackName?.trim() ?? "My Stack";
    const userGoal = req.body.userGoal?.trim() ?? "general fitness";

    if (!userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    if (!Array.isArray(supplementIds)) {
      res.status(400).json({
        success: false,
        error: "supplementIds must be an array",
      });
      return;
    }

    const validationError = ensureValidSupplementIds(supplementIds);
    if (validationError) {
      res.status(400).json({ success: false, error: validationError });
      return;
    }

    const existingSupplementsCount = await Supplement.countDocuments({
      _id: { $in: supplementIds.map((id) => new Types.ObjectId(id)) },
    }).exec();

    if (existingSupplementsCount !== supplementIds.length) {
      res.status(404).json({
        success: false,
        error: "Some supplements were not found",
      });
      return;
    }

    const savedStack: SavedStack = {
      id: new Types.ObjectId().toHexString(),
      stackName,
      userGoal,
      supplementIds,
      createdAt: new Date().toISOString(),
    };

    const updateResult = await User.collection.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $push: { savedStacks: savedStack } } as Record<string, unknown>,
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.status(201).json({
      success: true,
      data: savedStack,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("saveStack failed", message);
    res.status(500).json({
      success: false,
      error: "Failed to save stack",
    });
  }
};
