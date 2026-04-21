"use client";

import { useMemo, useState } from "react";

const MAX_SELECTED_SYMPTOMS = 10;

interface UseSymptomSelectionResult {
  selectedSymptoms: string[];
  toggleSymptom: (symptom: string) => void;
  clearSymptoms: () => void;
  isAtLimit: boolean;
}

/**
 * WHY: Manage symptom picker state with a strict max-selection cap.
 */
export const useSymptomSelection = (): UseSymptomSelectionResult => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string): void => {
    setSelectedSymptoms((previous) => {
      const exists = previous.includes(symptom);

      if (exists) {
        return previous.filter((item) => item !== symptom);
      }

      if (previous.length >= MAX_SELECTED_SYMPTOMS) {
        return previous;
      }

      return [...previous, symptom];
    });
  };

  const clearSymptoms = (): void => {
    setSelectedSymptoms([]);
  };

  const isAtLimit = useMemo(
    () => selectedSymptoms.length >= MAX_SELECTED_SYMPTOMS,
    [selectedSymptoms.length],
  );

  return {
    selectedSymptoms,
    toggleSymptom,
    clearSymptoms,
    isAtLimit,
  };
};
