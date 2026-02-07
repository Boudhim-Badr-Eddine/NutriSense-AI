"use client";

import { MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChatFloatingButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

/**
 * WHY: Provide a persistent entry point for the chat widget.
 */
export const ChatFloatingButton = ({
  onClick,
  hasUnread = false,
}: ChatFloatingButtonProps) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <div className="relative">
        {hasUnread && (
          <Badge className="absolute -right-2 -top-2 flex h-6 w-6 animate-pulse items-center justify-center rounded-full p-0">
            AI
          </Badge>
        )}
        <Button
          onClick={onClick}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Open NutriSense AI chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
