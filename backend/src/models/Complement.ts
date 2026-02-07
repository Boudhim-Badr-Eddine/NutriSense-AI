import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Model,
  Schema,
} from "mongoose";
import slugify from "slugify";

export type ComplementCategory =
  | "vitamin"
  | "mineral"
  | "antioxidant"
  | "omega"
  | "adaptogen";

export interface ComplementFoodSource {
  food: string;
  quantityPer100g: number;
  unit: string;
}

export interface ComplementDailyIntake {
  men: string;
  women: string;
  pregnant: string;
  athletes: string;
}

export interface ComplementSupplementForm {
  form: string;
  bioavailability: string;
}

export interface ComplementDocument extends Document {
  name: string;
  slug: string;
  category: ComplementCategory;
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  foodSources: ComplementFoodSource[];
  dailyIntake: ComplementDailyIntake;
  supplementForms: ComplementSupplementForm[];
  interactions: string[];
  contraindications: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplementModel extends Model<ComplementDocument> {
  findByCategory(category: ComplementCategory): Promise<ComplementDocument[]>;
  search(query: string): Promise<ComplementDocument[]>;
}

const foodSourceSchema = new Schema<ComplementFoodSource>(
  {
    food: { type: String, required: true, trim: true },
    quantityPer100g: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const dailyIntakeSchema = new Schema<ComplementDailyIntake>(
  {
    men: { type: String, required: true, trim: true },
    women: { type: String, required: true, trim: true },
    pregnant: { type: String, required: true, trim: true },
    athletes: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const supplementFormSchema = new Schema<ComplementSupplementForm>(
  {
    form: { type: String, required: true, trim: true },
    bioavailability: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const complementSchema = new Schema<ComplementDocument, ComplementModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["vitamin", "mineral", "antioxidant", "omega", "adaptogen"],
    },
    description: { type: String, required: true, trim: true },
    biologicalRole: { type: String, required: true, trim: true },
    deficiencySymptoms: { type: [String], default: [] },
    foodSources: { type: [foodSourceSchema], default: [] },
    dailyIntake: { type: dailyIntakeSchema, required: true },
    supplementForms: { type: [supplementFormSchema], default: [] },
    interactions: { type: [String], default: [] },
    contraindications: { type: [String], default: [] },
    images: { type: [String], default: [] },
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

complementSchema.pre(
  "save",
  function onSave(
    this: ComplementDocument,
    next: CallbackWithoutResultAndOptionalError,
  ) {
    if (!this.isModified("name")) {
      return next();
    }

    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
    return next();
  },
);

complementSchema.virtual("url").get(function getUrl(this: ComplementDocument) {
  return `/complements/${this.slug}`;
});

/**
 * WHY: Provides a canonical category filter across APIs.
 */
complementSchema.statics.findByCategory = function findByCategory(
  this: ComplementModel,
  category: ComplementCategory,
): Promise<ComplementDocument[]> {
  return this.find({ category }).exec();
};

/**
 * WHY: Centralizes full-text search for complements.
 */
complementSchema.statics.search = function search(
  this: ComplementModel,
  query: string,
): Promise<ComplementDocument[]> {
  return this.find({ $text: { $search: query } }).exec();
};

complementSchema.index({ category: 1 });
complementSchema.index({ name: "text", description: "text" });

export const Complement =
  mongoose.models.Complement ||
  mongoose.model<ComplementDocument, ComplementModel>(
    "Complement",
    complementSchema,
  );
