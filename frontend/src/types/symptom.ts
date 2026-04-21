export interface SymptomResult {
  complement: {
    _id: string;
    name: string;
    slug: string;
    category: string;
    deficiencySymptoms: string[];
    dailyIntake: {
      men: string;
      women: string;
      athletes: string;
    };
  };
  matchedSymptoms: string[];
  matchScore: number;
  confidence: 'high' | 'medium' | 'low';
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

export interface SymptomCheckResponse {
  success: boolean;
  data: {
    results: SymptomResult[];
    aiAnalysis: string;
    disclaimer: string;
    symptomsChecked: string[];
  };
}
