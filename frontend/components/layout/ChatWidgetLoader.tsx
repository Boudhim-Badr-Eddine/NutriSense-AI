"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/chat/ChatWidget").then((mod) => mod.ChatWidget),
  {
    ssr: false,
    loading: () => null,
  },
);

/**
 * WHY: Load chat widget only on the client to avoid SSR issues.
 */
export const ChatWidgetLoader = () => {
  return <ChatWidget />;
};
