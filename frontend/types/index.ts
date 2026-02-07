export interface Link {
  text: string;
  url: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  links?: Link[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFavorites {
  supplements: string[];
  complements: string[];
  foods: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: UserFavorites;
  createdAt: string;
  updatedAt: string;
}

export interface ScientificStudy {
  title: string;
  url: string;
  summary: string;
}

export interface Supplement {
  id: string;
  name: string;
  slug: string;
  category: "proteins" | "creatine" | "bcaa" | "pre-workout" | "recovery";
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  duration: string;
  ingredients: string[];
  contraindications: string[];
  scientificStudies: ScientificStudy[];
  images: string[];
  goals: string[];
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodSource {
  food: string;
  quantityPer100g: number;
  unit: string;
}

export interface DailyIntake {
  men: string;
  women: string;
  pregnant: string;
  athletes: string;
}

export interface SupplementForm {
  form: string;
  bioavailability: string;
}

export interface Complement {
  id: string;
  name: string;
  slug: string;
  category: "vitamin" | "mineral" | "antioxidant" | "omega" | "adaptogen";
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  foodSources: FoodSource[];
  dailyIntake: DailyIntake;
  supplementForms: SupplementForm[];
  interactions: string[];
  contraindications: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VitaminMineral {
  name: string;
  amount: number;
  unit: string;
}

export interface FoodPer100g {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitamins: VitaminMineral[];
  minerals: VitaminMineral[];
}

export interface Food {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: "animal" | "vegetal" | "supplement";
  per100g: FoodPer100g;
  benefits: string[];
  mealIdeas: string[];
  dietaryTags: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  details?: string;
  pagination?: PaginationMeta;
}
