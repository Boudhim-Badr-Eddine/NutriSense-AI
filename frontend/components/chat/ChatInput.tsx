"use client";

import { Send } from "lucide-react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject } from "react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 500;

/**
 * WHY: Capture user questions with keyboard-friendly controls.
 */
export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetTextarea = useCallback(
    (ref: MutableRefObject<HTMLTextAreaElement | null>) => {
      if (!ref.current) {
        return;
      }
      ref.current.style.height = "auto";
    },
  );

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled || message.length > MAX_CHARS) {
      return;
    }
    onSend(message.trim());
    setMessage("");
    resetTextarea(textareaRef);
  }, [disabled, message, onSend, resetTextarea]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    },
    [],
  );

  const isOverLimit = message.length > MAX_CHARS;

  return (
    <div className="border-t bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about supplements, foods, or nutrition goals"
            className="min-h-[64px] max-h-[140px] resize-none"
            disabled={disabled}
          />
          <div
            className={`mt-1 text-right text-xs ${
              isOverLimit ? "text-red-500" : "text-slate-500"
            }`}
          >
            {message.length}/{MAX_CHARS}
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim() || isOverLimit}
          size="lg"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
