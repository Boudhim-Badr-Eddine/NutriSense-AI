"use client";

import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  "What is creatine?",
  "Best protein sources?",
  "How much vitamin D daily?",
  "Benefits of omega-3?",
];

/**
 * WHY: Offer quick-start prompts to reduce empty state friction.
 */
export const SuggestionChips = ({ onSelect }: SuggestionChipsProps) => {
  return (
    <div className="border-t bg-slate-50 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
