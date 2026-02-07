import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Model,
  Schema,
} from "mongoose";
import slugify from "slugify";

export type FoodType = "animal" | "vegetal" | "supplement";

export interface FoodVitamin {
  name: string;
  amount: number;
  unit: string;
}

export interface FoodMineral {
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
  vitamins: FoodVitamin[];
  minerals: FoodMineral[];
}

export interface FoodDocument extends Document {
  name: string;
  slug: string;
  category: string;
  type: FoodType;
  per100g: FoodPer100g;
  benefits: string[];
  mealIdeas: string[];
  dietaryTags: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodModel extends Model<FoodDocument> {
  topProteins(limit: number): Promise<FoodDocument[]>;
  topCarbs(limit: number): Promise<FoodDocument[]>;
  topFats(limit: number): Promise<FoodDocument[]>;
}

const vitaminSchema = new Schema<FoodVitamin>(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const mineralSchema = new Schema<FoodMineral>(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const per100gSchema = new Schema<FoodPer100g>(
  {
    calories: { type: Number, required: true, min: 0 },
    proteins: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
    fiber: { type: Number, required: true, min: 0 },
    vitamins: { type: [vitaminSchema], default: [] },
    minerals: { type: [mineralSchema], default: [] },
  },
  { _id: false },
);

const foodSchema = new Schema<FoodDocument, FoodModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["animal", "vegetal", "supplement"],
    },
    per100g: {
      type: per100gSchema,
      required: true,
      validate: {
        validator: (value: FoodPer100g): boolean =>
          value.proteins + value.carbs + value.fats <= 100,
        message: "Proteins + carbs + fats must be <= 100 per 100g",
      },
    },
    benefits: { type: [String], default: [] },
    mealIdeas: { type: [String], default: [] },
    dietaryTags: { type: [String], default: [] },
    image: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        const result = { ...ret } as Record<string, unknown> & { __v?: number };
        delete result.__v;
        return result;
      },
    },
  },
);

foodSchema.pre(
  "save",
  function onSave(
    this: FoodDocument,
    next: CallbackWithoutResultAndOptionalError,
  ) {
    if (this.isModified("name")) {
      this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
    }
    return next();
  },
);

foodSchema.virtual("proteinCalorieRatio").get(function getProteinCalorieRatio(
  this: FoodDocument,
) {
  const calories = this.per100g.calories;
  if (!calories) {
    return 0;
  }
  return ((this.per100g.proteins * 4) / calories) * 100;
});

foodSchema.virtual("proteinPercentage").get(function getProteinPercentage(
  this: FoodDocument,
) {
  const totalMacros =
    this.per100g.proteins + this.per100g.carbs + this.per100g.fats;
  if (!totalMacros) {
    return 0;
  }
  return (this.per100g.proteins / totalMacros) * 100;
});

foodSchema.virtual("macroBreakdown").get(function getMacroBreakdown(
  this: FoodDocument,
) {
  const totalMacros =
    this.per100g.proteins + this.per100g.carbs + this.per100g.fats;
  if (!totalMacros) {
    return { proteins: 0, carbs: 0, fats: 0 };
  }
  return {
    proteins: (this.per100g.proteins / totalMacros) * 100,
    carbs: (this.per100g.carbs / totalMacros) * 100,
    fats: (this.per100g.fats / totalMacros) * 100,
  };
});

/**
 * WHY: Returns top protein sources with consistent sorting.
 */
foodSchema.statics.topProteins = function topProteins(
  this: FoodModel,
  limit: number,
): Promise<FoodDocument[]> {
  return this.find().sort({ "per100g.proteins": -1 }).limit(limit).exec();
};

/**
 * WHY: Returns top carbohydrate sources with consistent sorting.
 */
foodSchema.statics.topCarbs = function topCarbs(
  this: FoodModel,
  limit: number,
): Promise<FoodDocument[]> {
  return this.find().sort({ "per100g.carbs": -1 }).limit(limit).exec();
};

/**
 * WHY: Returns top fat sources with consistent sorting.
 */
foodSchema.statics.topFats = function topFats(
  this: FoodModel,
  limit: number,
): Promise<FoodDocument[]> {
  return this.find().sort({ "per100g.fats": -1 }).limit(limit).exec();
};

foodSchema.index({ category: 1 });
foodSchema.index({ type: 1 });
foodSchema.index({ dietaryTags: 1 });
foodSchema.index({ name: "text", category: "text" });
foodSchema.index({ "per100g.proteins": -1 });
foodSchema.index({ "per100g.carbs": -1 });
foodSchema.index({ "per100g.fats": -1 });

export const Food =
  mongoose.models.Food ||
  mongoose.model<FoodDocument, FoodModel>("Food", foodSchema);
