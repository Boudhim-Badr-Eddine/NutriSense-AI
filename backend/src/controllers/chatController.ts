import { Request, Response } from "express";

import { ConversationMessage } from "../models/Conversation";
import {
  addMessage,
  clearHistory,
  getHistory,
  getOrCreateConversation,
  getUserConversations,
} from "../services/conversationService";
import { processQuestion } from "../services/ragService";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { logger } from "../utils/logger";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface SendMessageBody {
  message: string;
  conversationId?: string;
}

/**
 * WHY: Handle chat messages with RAG pipeline and persistence.
 */
export const sendMessage = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    const { message, conversationId } = req.body as SendMessageBody;

    if (!message) {
      throw ApiError.badRequest("Message is required");
    }

    const conversation = await getOrCreateConversation(userId, conversationId);
    const history = getHistory(conversation, 10);

    const formattedHistory = history.map((entry: ConversationMessage) => ({
      role: entry.role,
      content: entry.content,
    }));

    const ragResult = await processQuestion(message, formattedHistory);

    await addMessage(conversation, "user", message);
    await addMessage(
      conversation,
      "assistant",
      ragResult.answer,
      ragResult.links,
    );

    res.status(200).json({
      success: true,
      data: {
        response: ragResult.answer,
        links: ragResult.links,
        sources: ragResult.sources,
        conversationId: conversation.id,
      },
    });
  },
);

/**
 * WHY: Return conversation history for authenticated user.
 */
export const getHistoryByUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    const conversations = await getUserConversations(userId);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  },
);

/**
 * WHY: Clear all conversation history for the authenticated user.
 */
export const clearHistoryByUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    await clearHistory(userId);
    logger.info(`Cleared chat history for user ${userId}`);

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
