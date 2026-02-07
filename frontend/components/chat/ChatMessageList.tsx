"use client";

import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

/**
 * WHY: Keep the latest messages visible without manual scrolling.
 */
export const ChatMessageList = ({
  messages,
  isLoading = false,
}: ChatMessageListProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      {messages.length === 0 && !isLoading && (
        <div className="mt-10 text-center text-sm text-slate-500">
          <p className="text-base font-semibold text-slate-700">
            Welcome to NutriSense AI
          </p>
          <p className="mt-2 text-sm">
            Ask anything about supplements, diets, and nutrition.
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <ChatMessage key={`${message.role}-${index}`} message={message} />
      ))}

      {isLoading && (
        <div className="mb-4 flex justify-start">
          <TypingIndicator />
        </div>
      )}

      <div ref={endRef} />
    </ScrollArea>
  );
};
