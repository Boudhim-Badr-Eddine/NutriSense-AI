import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Model,
  Schema,
} from "mongoose";
import slugify from "slugify";

export type SupplementCategory =
  | "proteins"
  | "creatine"
  | "bcaa"
  | "pre-workout"
  | "recovery";

export type SupplementGoal = "mass" | "cutting" | "endurance";

export interface SupplementStudy {
  title: string;
  url: string;
  summary: string;
}

export interface SupplementDocument extends Document {
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
  scientificStudies: SupplementStudy[];
  images: string[];
  goals: SupplementGoal[];
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
  incrementPopularity(): Promise<SupplementDocument>;
}

export interface SupplementModel extends Model<SupplementDocument> {
  findByCategory(category: SupplementCategory): Promise<SupplementDocument[]>;
  search(query: string): Promise<SupplementDocument[]>;
  topByPopularity(limit: number): Promise<SupplementDocument[]>;
}

const scientificStudySchema = new Schema<SupplementStudy>(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const supplementSchema = new Schema<SupplementDocument, SupplementModel>(
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
      enum: ["proteins", "creatine", "bcaa", "pre-workout", "recovery"],
    },
    description: {
      type: String,
      required: true,
      minlength: 50,
      trim: true,
    },
    benefits: { type: [String], default: [] },
    dosage: { type: String, required: true, trim: true },
    timing: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    ingredients: { type: [String], default: [] },
    contraindications: { type: [String], default: [] },
    scientificStudies: { type: [scientificStudySchema], default: [] },
    images: { type: [String], default: [] },
    goals: {
      type: [String],
      enum: ["mass", "cutting", "endurance"],
      default: [],
    },
    popularity: { type: Number, default: 0, min: 0 },
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

supplementSchema.pre(
  "save",
  function onSave(
    this: SupplementDocument,
    next: CallbackWithoutResultAndOptionalError,
  ) {
    if (!this.isModified("name")) {
      return next();
    }

    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
    return next();
  },
);

supplementSchema.virtual("url").get(function getUrl(this: SupplementDocument) {
  return `/supplements/${this.slug}`;
});

/**
 * WHY: Encapsulates popularity increments for consistent sorting behavior.
 */
supplementSchema.methods.incrementPopularity =
  async function incrementPopularity(
    this: SupplementDocument,
  ): Promise<SupplementDocument> {
    this.popularity += 1;
    return this.save();
  };

/**
 * WHY: Provides a canonical category filter across APIs.
 */
supplementSchema.statics.findByCategory = function findByCategory(
  this: SupplementModel,
  category: SupplementCategory,
): Promise<SupplementDocument[]> {
  return this.find({ category }).exec();
};

/**
 * WHY: Centralizes full-text search for supplements.
 */
supplementSchema.statics.search = function search(
  this: SupplementModel,
  query: string,
): Promise<SupplementDocument[]> {
  return this.find({ $text: { $search: query } }).exec();
};

/**
 * WHY: Retrieves trending supplements with consistent ordering.
 */
supplementSchema.statics.topByPopularity = function topByPopularity(
  this: SupplementModel,
  limit: number,
): Promise<SupplementDocument[]> {
  return this.find().sort({ popularity: -1 }).limit(limit).exec();
};

supplementSchema.index({ category: 1 });
supplementSchema.index({ goals: 1 });
supplementSchema.index({ popularity: -1 });
supplementSchema.index({ name: "text", description: "text" });

export const Supplement =
  mongoose.models.Supplement ||
  mongoose.model<SupplementDocument, SupplementModel>(
    "Supplement",
    supplementSchema,
  );
