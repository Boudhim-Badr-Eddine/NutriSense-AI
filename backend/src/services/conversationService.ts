import { Types } from "mongoose";

import {
  Conversation,
  ConversationDocument,
  ConversationLink,
  ConversationMessage,
  ConversationRole,
} from "../models/Conversation";
import { ApiError } from "../utils/ApiError";

/**
 * WHY: Create or load a conversation scoped to a user.
 */
export const getOrCreateConversation = async (
  userId: string,
  conversationId?: string,
): Promise<ConversationDocument> => {
  const userObjectId = new Types.ObjectId(userId);

  if (conversationId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userObjectId,
    });

    if (!conversation) {
      throw ApiError.notFound("Conversation not found");
    }

    return conversation;
  }

  return Conversation.create({ userId: userObjectId, messages: [] });
};

/**
 * WHY: Add a message and keep history trimmed.
 */
export const addMessage = async (
  conversation: ConversationDocument,
  role: ConversationRole,
  content: string,
  links: ConversationLink[] = [],
): Promise<ConversationDocument> => {
  return conversation.addMessage(role, content, links);
};

/**
 * WHY: Return recent messages for prompt context.
 */
export const getHistory = (
  conversation: ConversationDocument,
  count = 10,
): ConversationMessage[] => {
  return conversation.getRecentMessages(count);
};

/**
 * WHY: List conversations for a user.
 */
export const getUserConversations = async (
  userId: string,
): Promise<ConversationDocument[]> => {
  return Conversation.find({ userId }).sort({ updatedAt: -1 }).exec();
};

/**
 * WHY: Clear all conversation history for a user.
 */
export const clearHistory = async (userId: string): Promise<void> => {
  await Conversation.deleteMany({ userId }).exec();
};
