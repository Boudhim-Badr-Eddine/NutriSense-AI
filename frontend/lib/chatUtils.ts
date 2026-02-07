"use client";

import { useEffect } from "react";

interface ChatOpenDetail {
  question: string;
}

/**
 * WHY: Trigger the chat widget from any page with a prefilled question.
 */
export const openChatWithQuestion = (question: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  const event = new CustomEvent<ChatOpenDetail>("openChat", {
    detail: { question },
  });
  window.dispatchEvent(event);
};

/**
 * WHY: Listen for chat-open events without wiring global state.
 */
export const useChatEvents = (onOpen: (question: string) => void): void => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ChatOpenDetail>;
      if (customEvent.detail?.question) {
        onOpen(customEvent.detail.question);
      }
    };

    window.addEventListener("openChat", handler);
    return () => window.removeEventListener("openChat", handler);
  }, [onOpen]);
};
