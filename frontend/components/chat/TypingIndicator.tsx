"use client";

/**
 * WHY: Show the assistant is composing a reply.
 */
export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 shadow-sm">
      <div className="flex gap-1">
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-xs text-slate-500">Typing</span>
    </div>
  );
};
