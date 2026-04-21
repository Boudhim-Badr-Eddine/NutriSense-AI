import { ComplementCategory } from "../../models/Complement";
import { SupplementCategory, SupplementGoal } from "../../models/Supplement";

export interface SupplementCatalogItem {
  name: string;
  slug: string;
  category: SupplementCategory;
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  duration: string;
  ingredients: string[];
  contraindications: string[];
  scientificStudies: Array<{ title: string; url: string; summary: string }>;
  images: string[];
  goals: SupplementGoal[];
  popularity: number;
}

export interface ComplementCatalogItem {
  name: string;
  slug: string;
  category: ComplementCategory;
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  foodSources: Array<{ food: string; quantityPer100g: number; unit: string }>;
  dailyIntake: {
    men: string;
    women: string;
    pregnant: string;
    athletes: string;
  };
  supplementForms: Array<{ form: string; bioavailability: string }>;
  interactions: string[];
  contraindications: string[];
  images: string[];
}

export interface FoodCatalogItem {
  name: string;
  slug: string;
  category: string;
  type: "animal" | "vegetal" | "supplement";
  per100g: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
    vitamins: Array<{ name: string; amount: number; unit: string }>;
    minerals: Array<{ name: string; amount: number; unit: string }>;
  };
  benefits: string[];
  mealIdeas: string[];
  dietaryTags: string[];
  image: string;
}
