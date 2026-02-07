"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { SuggestionChips } from "./SuggestionChips";

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  prefilledQuestion?: string | null;
}

/**
 * WHY: Compose the main chat experience with responsive sizing.
 */
export const ChatWindow = ({
  onClose,
  onMinimize,
  prefilledQuestion,
}: ChatWindowProps) => {
  const { messages, sendMessage, clearConversation, isLoading, error } =
    useChat();
  const { user } = useAuth();
  const isLocked = !user;
  const hasPrefilledSent = useRef(false);

  useEffect(() => {
    if (prefilledQuestion && !hasPrefilledSent.current) {
      sendMessage(prefilledQuestion);
      hasPrefilledSent.current = true;
    }

    if (!prefilledQuestion) {
      hasPrefilledSent.current = false;
    }
  }, [prefilledQuestion, sendMessage]);

  const handleClear = () => {
    if (window.confirm("Clear this conversation?")) {
      clearConversation();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-6 sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl">
      <ChatHeader
        onClose={onClose}
        onMinimize={onMinimize}
        onClear={handleClear}
      />

      {error && (
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 text-xs text-red-700">
          <AlertTriangle className="h-4 w-4" />
          <span>Unable to reach the assistant. Please try again.</span>
        </div>
      )}

      {isLocked && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <span>Sign in to start chatting with NutriSense AI.</span>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )}

      <ChatMessageList messages={messages} isLoading={isLoading} />

      {messages.length === 0 && !isLoading && (
        <SuggestionChips onSelect={sendMessage} />
      )}

      <ChatInput onSend={sendMessage} disabled={isLoading || isLocked} />
    </div>
  );
};
