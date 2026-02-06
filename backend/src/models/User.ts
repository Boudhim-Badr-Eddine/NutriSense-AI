import bcrypt from "bcryptjs";
import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Schema,
  Types,
} from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  name?: string;
  role: "user" | "admin";
  favorites: {
    supplements: Types.ObjectId[];
    complements: Types.ObjectId[];
    foods: Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
  isModified(path?: string): boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    favorites: {
      supplements: [
        { type: Schema.Types.ObjectId, ref: "Supplement", default: [] },
      ],
      complements: [
        { type: Schema.Types.ObjectId, ref: "Complement", default: [] },
      ],
      foods: [{ type: Schema.Types.ObjectId, ref: "Food", default: [] }],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        const result = { ...ret } as Record<string, unknown> & {
          password?: string;
          __v?: number;
        };
        delete result.password;
        delete result.__v;
        return result;
      },
    },
  },
);

userSchema.pre(
  "save",
  async function onSave(
    this: UserDocument,
    next: CallbackWithoutResultAndOptionalError,
  ) {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  },
);

userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ createdAt: -1 });

export const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
