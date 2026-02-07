"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  const handleOpen = useCallback((question: string) => {
    setPrefilledQuestion(question);
    setIsOpen(true);
  }, []);

  useChatEvents(handleOpen);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setPrefilledQuestion(null);
  };

  return (
    <>
      {!isOpen && <ChatFloatingButton onClick={() => setIsOpen(true)} />}

      {isOpen && (
        <div
          className={
            isMobile
              ? "fixed inset-0 z-50"
              : "fixed bottom-6 right-6 z-50 h-[600px] w-[400px]"
          }
        >
          <ChatWindow
            onClose={handleClose}
            onMinimize={handleClose}
            prefilledQuestion={prefilledQuestion}
          />
        </div>
      )}
    </>
  );
};
