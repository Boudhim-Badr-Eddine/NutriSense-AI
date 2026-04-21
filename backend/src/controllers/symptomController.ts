import { Request, Response } from 'express';

import {
  getLinkedComplements,
  getSymptomWeight,
  resolveCanonicalSymptom,
} from '../data/symptomProfiles';
import { Complement, ComplementDocument } from '../models/Complement';
import { Food } from '../models/Food';
import { sendToGemini } from '../services/geminiService';

interface SymptomCheckBody {
  symptoms?: unknown;
}

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface SymptomMatchResult {
  complement: {
    _id: ComplementDocument['_id'];
    name: string;
    slug: string;
    category: ComplementDocument['category'];
    deficiencySymptoms: string[];
    dailyIntake: ComplementDocument['dailyIntake'];
  };
  matchedSymptoms: string[];
  matchScore: number;
  confidence: ConfidenceLevel;
  scoreBreakdown: {
    weightedCoverage: number;
    selectedCoverage: number;
    deficiencyCoverage: number;
    linkedComplementBonus: number;
  };
  recommendedFoods: Array<{
    name: string;
    slug: string | null;
    category: string | null;
    quantityPer100g: number;
    unit: string;
    benefits: string[];
  }>;
}

interface RelatedFood {
  name: string;
  slug: string;
  category: string;
  benefits: string[];
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const getConfidence = (score: number): ConfidenceLevel => {
  if (score >= 70) {
    return 'high';
  }

  if (score >= 45) {
    return 'medium';
  }

  return 'low';
};

const normalizeSymptoms = (symptoms: string[]): string[] => {
  const normalized = symptoms
    .map((symptom) => resolveCanonicalSymptom(normalizeText(symptom)))
    .filter((symptom) => symptom.length > 0);

  return Array.from(new Set(normalized));
};

const calculateMatchScore = (
  matchedSymptoms: string[],
  symptomsChecked: string[],
  deficiencySymptoms: string[],
  complementName: string,
): { score: number; breakdown: SymptomMatchResult['scoreBreakdown'] } => {
  const totalSelectedWeight = symptomsChecked.reduce(
    (sum, symptom) => sum + getSymptomWeight(symptom),
    0,
  );

  const matchedWeight = matchedSymptoms.reduce(
    (sum, symptom) => sum + getSymptomWeight(symptom),
    0,
  );

  const selectedCoverage =
    symptomsChecked.length > 0 ? matchedSymptoms.length / symptomsChecked.length : 0;
  const deficiencyCoverage =
    deficiencySymptoms.length > 0
      ? matchedSymptoms.length / deficiencySymptoms.length
      : 0;
  const weightedCoverage =
    totalSelectedWeight > 0 ? matchedWeight / totalSelectedWeight : 0;

  const hasLinkedComplement = matchedSymptoms.some((symptom) =>
    getLinkedComplements(symptom)
      .map((name) => normalizeText(name))
      .includes(normalizeText(complementName)),
  );
  const linkedComplementBonus = hasLinkedComplement ? 0.1 : 0;

  const score =
    weightedCoverage * 0.5 +
    selectedCoverage * 0.25 +
    deficiencyCoverage * 0.15 +
    linkedComplementBonus;

  return {
    score: Math.round(Math.min(score * 100, 100)),
    breakdown: {
      weightedCoverage: Math.round(weightedCoverage * 100),
      selectedCoverage: Math.round(selectedCoverage * 100),
      deficiencyCoverage: Math.round(deficiencyCoverage * 100),
      linkedComplementBonus: Math.round(linkedComplementBonus * 100),
    },
  };
};

const buildRecommendedFoods = (
  foodSources: Array<{ food: string; quantityPer100g: number; unit: string }>,
  relatedFoodsByName: Map<string, RelatedFood>,
): SymptomMatchResult['recommendedFoods'] => {
  return foodSources.slice(0, 4).map((source) => {
    const normalizedFoodName = normalizeText(source.food);
    const relatedFood = relatedFoodsByName.get(normalizedFoodName);

    return {
      name: source.food,
      slug: relatedFood?.slug ?? null,
      category: relatedFood?.category ?? null,
      quantityPer100g: source.quantityPer100g,
      unit: source.unit,
      benefits: relatedFood?.benefits ?? [],
    };
  });
};

/**
 * WHY: Analyze user symptoms against complement deficiencies and enrich response with AI explanation.
 */
export const checkSymptoms = async (
  req: Request<unknown, unknown, SymptomCheckBody>,
  res: Response,
): Promise<void> => {
  try {
    const rawSymptoms = req.body?.symptoms;

    if (!Array.isArray(rawSymptoms) || rawSymptoms.length === 0) {
      res.status(400).json({
        success: false,
        error: 'symptoms must be a non-empty array of strings',
      });
      return;
    }

    if (rawSymptoms.length > 15) {
      res.status(400).json({
        success: false,
        error: 'symptoms array cannot contain more than 15 items',
      });
      return;
    }

    const hasInvalidItem = rawSymptoms.some(
      (item) => typeof item !== 'string' || item.trim().length === 0,
    );

    if (hasInvalidItem) {
      res.status(400).json({
        success: false,
        error: 'each symptom must be a non-empty string',
      });
      return;
    }

    const symptomsChecked = normalizeSymptoms(rawSymptoms as string[]);

    if (symptomsChecked.length === 0) {
      res.status(400).json({
        success: false,
        error: 'symptoms must contain at least one non-empty string',
      });
      return;
    }

    const regexFilters = symptomsChecked.map((symptom) => ({
      deficiencySymptoms: {
        $elemMatch: { $regex: escapeRegex(symptom), $options: 'i' },
      },
    }));

    const matchedComplements = await Complement.find({ $or: regexFilters })
      .limit(6)
      .exec();

    const allFoodSourceNames = Array.from(
      new Set(
        matchedComplements
          .flatMap((complement) =>
            complement.foodSources.map(
              (item: { food: string; quantityPer100g: number; unit: string }) =>
                item.food,
            ),
          )
          .map((item) => normalizeText(item)),
      ),
    );

    const relatedFoods = allFoodSourceNames.length
      ? await Food.find({
          $or: allFoodSourceNames.map((foodName) => ({
            name: { $regex: escapeRegex(foodName), $options: 'i' },
          })),
        })
          .select('name slug category benefits')
          .limit(32)
          .lean()
          .exec()
      : [];

    const relatedFoodsByName = new Map<string, RelatedFood>(
      relatedFoods.map((item) => [
        normalizeText(item.name),
        {
          name: item.name,
          slug: item.slug,
          category: item.category,
          benefits: item.benefits,
        },
      ]),
    );

    const results: SymptomMatchResult[] = matchedComplements
      .map((complement) => {
        const matchedSymptoms = symptomsChecked.filter((symptom) =>
          complement.deficiencySymptoms.some((deficiencySymptom: string) =>
            new RegExp(escapeRegex(symptom), 'i').test(deficiencySymptom),
          ),
        );

        const { score: matchScore, breakdown } = calculateMatchScore(
          matchedSymptoms,
          symptomsChecked,
          complement.deficiencySymptoms.map((item: string) => normalizeText(item)),
          complement.name,
        );

        return {
          complement: {
            _id: complement._id,
            name: complement.name,
            slug: complement.slug,
            category: complement.category,
            deficiencySymptoms: complement.deficiencySymptoms,
            dailyIntake: complement.dailyIntake,
          },
          matchedSymptoms,
          matchScore,
          confidence: getConfidence(matchScore),
          scoreBreakdown: breakdown,
          recommendedFoods: buildRecommendedFoods(
            complement.foodSources,
            relatedFoodsByName,
          ),
        };
      })
      .filter((result) => result.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    const matchedNames =
      results.length > 0
        ? results.map((result) => result.complement.name).join(', ')
        : 'none clearly identified in our database';

    const prompt = `You are a nutrition expert assistant for NutriSense AI.
The user reported these symptoms: ${symptomsChecked.join(', ')}.
Based on nutritional science, our database found possible deficiencies in: ${matchedNames}.
Write a short, warm, professional analysis (max 150 words) explaining:
- What these deficiencies mean
- Why these symptoms appear together
- A gentle reminder to consult a healthcare professional
Do NOT use markdown formatting. Write in plain paragraphs.`;

    const aiAnalysis = await sendToGemini(prompt, '');

    res.status(200).json({
      success: true,
      data: {
        results,
        aiAnalysis,
        disclaimer:
          'This tool is for educational purposes only. Always consult a healthcare professional before starting any supplementation.',
        symptomsChecked,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      success: false,
      error: message,
    });
  }
};
