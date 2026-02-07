import {
  ComplementResult,
  FoodResult,
  SearchResults,
  SupplementResult,
} from "./searchService";

const formatSupplement = (supplement: SupplementResult, index: number) => {
  return `${index + 1}. ${supplement.name} (${supplement.category})\n   Description: ${supplement.description}\n   Dosage: ${supplement.dosage}\n   Timing: ${supplement.timing}\n   Benefits: ${supplement.benefits.join(", ") || "N/A"}`;
};

const formatComplement = (complement: ComplementResult, index: number) => {
  return `${index + 1}. ${complement.name} (${complement.category})\n   Description: ${complement.description}\n   Biological role: ${complement.biologicalRole}\n   Deficiency symptoms: ${complement.deficiencySymptoms.join(", ") || "N/A"}`;
};

const formatFood = (food: FoodResult, index: number) => {
  return `${index + 1}. ${food.name} (${food.category})\n   Calories: ${food.per100g.calories} kcal | Protein: ${food.per100g.proteins}g | Carbs: ${food.per100g.carbs}g | Fats: ${food.per100g.fats}g\n   Benefits: ${food.benefits.join(", ") || "N/A"}`;
};

/**
 * WHY: Provide a consistent, clean context block for Gemini.
 */
export const buildContext = (results: SearchResults): string => {
  const supplementBlock = results.supplements.length
    ? [
        "=== SUPPLEMENTS ===",
        ...results.supplements.map(formatSupplement),
      ].join("\n")
    : "=== SUPPLEMENTS ===\nNo relevant supplements found.";

  const complementBlock = results.complements.length
    ? [
        "=== COMPLEMENTS ===",
        ...results.complements.map(formatComplement),
      ].join("\n")
    : "=== COMPLEMENTS ===\nNo relevant complements found.";

  const foodBlock = results.foods.length
    ? ["=== FOODS ===", ...results.foods.map(formatFood)].join("\n")
    : "=== FOODS ===\nNo relevant foods found.";

  return [supplementBlock, complementBlock, foodBlock].join("\n\n");
};
