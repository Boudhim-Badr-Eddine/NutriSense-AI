export interface StackSupplement {
  _id: string;
  name: string;
  slug: string;
  category: string;
  dosage: string;
  timing: string;
  benefits: string[];
  goals: string[];
}

export interface CompatibilityRule {
  supplements: string[];
  type: 'synergy' | 'caution' | 'avoid' | 'neutral';
  title: string;
  reason: string;
  timing?: string;
}

export interface TimingSchedule {
  morning: StackSupplement[];
  preWorkout: StackSupplement[];
  postWorkout: StackSupplement[];
  withMeals: StackSupplement[];
  beforeBed: StackSupplement[];
}

export interface StackAnalysisResult {
  supplements: StackSupplement[];
  compatibilityReport: {
    synergies: CompatibilityRule[];
    cautions: CompatibilityRule[];
    avoids: CompatibilityRule[];
  };
  stackScore: number;
  stackRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  timingSchedule: TimingSchedule;
  aiAnalysis: string;
  disclaimer: string;
}
