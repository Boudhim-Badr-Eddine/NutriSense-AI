"use client";

import { Bot, Minus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  onClear: () => void;
}

/**
 * WHY: Keep chat controls visible and branded across screen sizes.
 */
export const ChatHeader = ({
  onClose,
  onMinimize,
  onClear,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold sm:text-base">NutriSense AI</h3>
          <p className="text-xs opacity-90">Ask anything about nutrition</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onClear}
          aria-label="Clear conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onMinimize}
          aria-label="Minimize chat"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
