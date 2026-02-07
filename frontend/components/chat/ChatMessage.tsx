"use client";

import Link from "next/link";

import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";
import type { ChatLink } from "@/lib/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

interface MessagePart {
  type: "text" | "link";
  value: string;
  url?: string;
}

const buildMessageParts = (
  content: string,
  links: ChatLink[] = [],
): MessagePart[] => {
  if (!links.length) {
    return [{ type: "text", value: content }];
  }

  const parts: MessagePart[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    let earliestIndex = -1;
    let matchedLink: ChatLink | null = null;

    links.forEach((link) => {
      const index = remaining.indexOf(link.text);
      if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
        earliestIndex = index;
        matchedLink = link;
      }
    });

    if (!matchedLink || earliestIndex === -1) {
      parts.push({ type: "text", value: remaining });
      break;
    }

    if (earliestIndex > 0) {
      parts.push({
        type: "text",
        value: remaining.slice(0, earliestIndex),
      });
    }

    parts.push({
      type: "link",
      value: matchedLink.text,
      url: matchedLink.url,
    });

    remaining = remaining.slice(earliestIndex + matchedLink.text.length);
  }

  return parts;
};

const isExternalUrl = (url: string): boolean => /^https?:\/\//i.test(url);

/**
 * WHY: Render user and assistant messages with safe links.
 */
export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const parts = buildMessageParts(message.content, message.links ?? []);
  const timestamp =
    message.timestamp instanceof Date
      ? message.timestamp
      : new Date(message.timestamp);

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[82%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-primary text-white"
              : message.status === "error"
                ? "bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-900"
          }`}
        >
          <span className="whitespace-pre-wrap">
            {parts.map((part, index) => {
              if (part.type === "text") {
                return <span key={`${part.type}-${index}`}>{part.value}</span>;
              }

              if (!part.url) {
                return <span key={`${part.type}-${index}`}>{part.value}</span>;
              }

              if (isExternalUrl(part.url)) {
                return (
                  <a
                    key={`${part.type}-${index}`}
                    href={part.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline underline-offset-2 transition-colors hover:text-primary/80"
                  >
                    {part.value}
                  </a>
                );
              }

              return (
                <Link
                  key={`${part.type}-${index}`}
                  href={part.url}
                  className="font-semibold underline underline-offset-2 transition-colors hover:text-primary/80"
                >
                  {part.value}
                </Link>
              );
            })}
          </span>
        </div>
        <div className="mt-1 px-2 text-xs text-slate-500">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <div className={`${isUser ? "order-1 mr-2" : "order-2 ml-2"}`}>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold shadow-sm ${
            isUser ? "bg-primary text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          {isUser ? "You" : "AI"}
        </div>
      </div>
    </div>
  );
};
