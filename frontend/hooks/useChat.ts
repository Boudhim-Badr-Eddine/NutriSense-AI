"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/app/AuthContext";
import { chatApi, ChatLink } from "@/lib/chat";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  links?: ChatLink[];
  timestamp: Date;
  status?: "success" | "error";
}

const AUTH_TOKEN_KEY = "authToken";
const CONVERSATION_STORAGE_KEY = "chatConversationId";

interface UseChatResult {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  clearConversation: () => void;
  isLoading: boolean;
  error: Error | null;
}

/**
 * WHY: Provide chat state and messaging helpers for the widget UI.
 */
export const useChat = (): UseChatResult => {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasLoadedHistory = useRef(false);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setConversationId(undefined);
      hasLoadedHistory.current = false;
      return;
    }

    if (hasLoadedHistory.current) {
      return;
    }

    hasLoadedHistory.current = true;

    const storedConversationId =
      typeof window !== "undefined"
        ? window.localStorage.getItem(CONVERSATION_STORAGE_KEY)
        : null;

    chatApi
      .getHistory()
      .then((conversations) => {
        if (!conversations.length) {
          return;
        }

        const sorted = [...conversations].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime(),
        );
        const activeConversation =
          (storedConversationId &&
            sorted.find((conversation) =>
              conversation.id === storedConversationId
            )) ||
          sorted[0];

        if (!activeConversation) {
          return;
        }

        setConversationId(activeConversation.id);
        setMessages(
          activeConversation.messages.map((message) => ({
            role: message.role,
            content: message.content,
            links: message.links,
            timestamp: new Date(message.timestamp),
            status: "success",
          })),
        );
      })
      .catch(() => {
        hasLoadedHistory.current = false;
      });
  }, [user]);

  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onMutate: (variables) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: variables.message,
          timestamp: new Date(),
          status: "success",
        },
      ]);
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          links: data.links,
          timestamp: new Date(),
          status: "success",
        },
      ]);
      setConversationId(data.conversationId);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          CONVERSATION_STORAGE_KEY,
          data.conversationId,
        );
      }
    },
    onError: (error) => {
      const isUnauthorized =
        isAxiosError(error) && error.response?.status === 401;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isUnauthorized
            ? "Please sign in to use the AI assistant."
            : "Sorry, I could not reach the assistant. Please try again shortly.",
          timestamp: new Date(),
          status: "error",
        },
      ]);
    },
  });

  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim()) {
        return;
      }

      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
          setMessages((prev) => [
            ...prev,
            {
              role: "user",
              content: message,
              timestamp: new Date(),
              status: "success",
            },
            {
              role: "assistant",
              content: "Please sign in to use the AI assistant.",
              timestamp: new Date(),
              status: "error",
            },
          ]);
          return;
        }
      }

      sendMessageMutation.mutate({
        message,
        conversationId,
      });
    },
    [conversationId, sendMessageMutation],
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CONVERSATION_STORAGE_KEY);
    }
    chatApi.clearHistory().catch(() => undefined);
  }, []);

  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error ?? null,
  };
};
