import type { ApiResponse, Conversation } from '@/types';

import { api } from './api';

export interface ChatLink {
  text: string;
  url: string;
  type: string;
}

export interface SendMessageParams {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  answer: string;
  links: ChatLink[];
  conversationId: string;
}

interface ChatResponsePayload {
  answer?: string;
  response?: string;
  links?: ChatLink[];
  conversationId: string;
}

/**
 * WHY: Centralize chat API calls for the widget and keep UI code clean.
 */
export const chatApi = {
  sendMessage: async (params: SendMessageParams): Promise<ChatResponse> => {
    const { data } = await api.post<ApiResponse<ChatResponsePayload>>(
      '/chat',
      params,
    );
    return {
      answer: data.data.answer ?? data.data.response ?? '',
      links: data.data.links ?? [],
      conversationId: data.data.conversationId,
    };
  },

  getHistory: async (): Promise<Conversation[]> => {
    const { data } = await api.get<ApiResponse<Conversation[]>>('/chat/history');
    return data.data;
  },

  clearHistory: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>('/chat/history');
    return data;
  },
};
