import { FilterQuery } from "mongoose";

import { Complement } from "../models/Complement";
import { Food } from "../models/Food";
import { Supplement } from "../models/Supplement";
import { logger } from "../utils/logger";

export interface SupplementResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  dosage: string;
  timing: string;
  benefits: string[];
  goals: string[];
  popularity: number;
}

export interface ComplementResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  interactions: string[];
  contraindications: string[];
}

export interface FoodResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: string;
  per100g: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  benefits: string[];
  dietaryTags: string[];
}

export interface SearchResults {
  supplements: SupplementResult[];
  complements: ComplementResult[];
  foods: FoodResult[];
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRegexQueries = (keywords: string[], fields: string[]) => {
  if (keywords.length === 0) {
    return [];
  }

  return keywords.flatMap((keyword) => {
    const regex = new RegExp(escapeRegex(keyword), "i");
    return fields.map((field) => ({ [field]: regex }));
  });
};

type SupplementLean = SupplementResult & { _id: unknown };
type ComplementLean = ComplementResult & { _id: unknown };
type FoodLean = FoodResult & { _id: unknown };

const mapSupplement = (doc: SupplementLean): SupplementResult => ({
  id: String(doc._id),
  name: doc.name,
  slug: doc.slug,
  category: doc.category,
  description: doc.description,
  dosage: doc.dosage,
  timing: doc.timing,
  benefits: doc.benefits,
  goals: doc.goals,
  popularity: doc.popularity,
});

const mapComplement = (doc: ComplementLean): ComplementResult => ({
  id: String(doc._id),
  name: doc.name,
  slug: doc.slug,
  category: doc.category,
  description: doc.description,
  biologicalRole: doc.biologicalRole,
  deficiencySymptoms: doc.deficiencySymptoms,
  interactions: doc.interactions,
  contraindications: doc.contraindications,
});

const mapFood = (doc: FoodLean): FoodResult => ({
  id: String(doc._id),
  name: doc.name,
  slug: doc.slug,
  category: doc.category,
  type: doc.type,
  per100g: doc.per100g,
  benefits: doc.benefits,
  dietaryTags: doc.dietaryTags,
});

/**
 * WHY: Search across supplements, complements, and foods for RAG context.
 */
export const searchDatabase = async (
  keywords: string[],
): Promise<SearchResults> => {
  logger.info(`RAG search keywords: ${keywords.join(", ")}`);

  const keywordString = keywords.join(" ");
  const supplementFilters: FilterQuery<unknown> = keywordString
    ? { $text: { $search: keywordString } }
    : {};

  const complementFilters: FilterQuery<unknown> = keywordString
    ? { $text: { $search: keywordString } }
    : {};

  const foodFilters: FilterQuery<unknown> = keywordString
    ? {
        $or: buildRegexQueries(keywords, ["name", "category"]),
      }
    : {};

  const [supplements, complements, foods] = await Promise.all([
    Supplement.find(supplementFilters)
      .select(
        "name slug category description dosage timing benefits goals popularity",
      )
      .sort({ popularity: -1 })
      .limit(5)
      .lean()
      .exec(),
    Complement.find(complementFilters)
      .select(
        "name slug category description biologicalRole deficiencySymptoms interactions contraindications",
      )
      .limit(5)
      .lean()
      .exec(),
    Food.find(foodFilters)
      .select("name slug category type per100g benefits dietaryTags")
      .limit(5)
      .lean()
      .exec(),
  ]);

  const supplementsLean = supplements as unknown as SupplementLean[];
  const complementsLean = complements as unknown as ComplementLean[];
  const foodsLean = foods as unknown as FoodLean[];

  return {
    supplements: supplementsLean.map(mapSupplement),
    complements: complementsLean.map(mapComplement),
    foods: foodsLean.map(mapFood),
  };
};
