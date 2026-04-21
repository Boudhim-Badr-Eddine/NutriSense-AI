export interface AnalyzedFood {
  name: string;
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: "high" | "medium" | "low";
  dbMatch?: {
    _id: string;
    name: string;
    slug: string;
  };
  hasDetailPage: boolean;
}

export interface MealAnalysisResult {
  foods: AnalyzedFood[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  macroPercentages: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealRating: string;
  portionAssessment: string;
  aiRecommendation: string;
  recommendedSupplements: Array<{
    _id: string;
    name: string;
    slug: string;
    category: string;
    dosage: string;
  }>;
  disclaimer: string;
}
