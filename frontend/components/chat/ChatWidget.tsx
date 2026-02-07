"use client";

import { useCallback, useState } from "react";

import { useChatEvents } from "@/lib/chatUtils";

import { ChatFloatingButton } from "./ChatFloatingButton";
import { ChatWindow } from "./ChatWindow";

/**
 * WHY: Orchestrate the floating chat UI across the entire app.
 */
export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledQuestion, setPrefilledQuestion] = useState<string | null>(
    null,
  );

  const handleOpen = useCallback((question: string) => {
    setPrefilledQuestion(question);
    setIsOpen(true);
  }, []);

  useChatEvents(handleOpen);

  const handleClose = () => {
    setIsOpen(false);
    setPrefilledQuestion(null);
  };

  return (
    <>
      {!isOpen && <ChatFloatingButton onClick={() => setIsOpen(true)} />}

      {isOpen && (
        <ChatWindow
          onClose={handleClose}
          onMinimize={handleClose}
          prefilledQuestion={prefilledQuestion}
        />
      )}
    </>
  );
};
