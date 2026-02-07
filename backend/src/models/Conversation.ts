import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ConversationRole = "user" | "assistant";

export interface ConversationLink {
  text: string;
  url: string;
}

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  links: ConversationLink[];
  timestamp: Date;
}

export interface ConversationDocument extends Document {
  userId: Types.ObjectId;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
  addMessage(
    role: ConversationRole,
    content: string,
    links?: ConversationLink[],
  ): Promise<ConversationDocument>;
  getRecentMessages(count: number): ConversationMessage[];
  clear(): Promise<ConversationDocument>;
}

export interface ConversationModel extends Model<ConversationDocument> {}

const linkSchema = new Schema<ConversationLink>(
  {
    text: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const messageSchema = new Schema<ConversationMessage>(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"],
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    links: { type: [linkSchema], default: [] },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const conversationSchema = new Schema<ConversationDocument, ConversationModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: {
      type: [messageSchema],
      default: [],
      validate: {
        validator: (value: ConversationMessage[]): boolean =>
          value.length <= 100,
        message: "Conversation cannot exceed 100 messages",
      },
    },
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

/**
 * WHY: Adds a message while enforcing max history size.
 */
conversationSchema.methods.addMessage = async function addMessage(
  this: ConversationDocument,
  role: ConversationRole,
  content: string,
  links: ConversationLink[] = [],
): Promise<ConversationDocument> {
  this.messages.push({ role, content, links, timestamp: new Date() });
  if (this.messages.length > 50) {
    this.messages = this.messages.slice(-50);
  }
  return this.save();
};

/**
 * WHY: Returns a consistent slice of recent conversation history.
 */
conversationSchema.methods.getRecentMessages = function getRecentMessages(
  this: ConversationDocument,
  count: number,
): ConversationMessage[] {
  const safeCount = Math.max(0, Math.min(count, this.messages.length));
  return this.messages.slice(-safeCount);
};

/**
 * WHY: Clears conversation history in a single operation.
 */
conversationSchema.methods.clear = async function clear(
  this: ConversationDocument,
): Promise<ConversationDocument> {
  this.messages = [];
  return this.save();
};

conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, updatedAt: -1 });

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<ConversationDocument, ConversationModel>(
    "Conversation",
    conversationSchema,
  );
