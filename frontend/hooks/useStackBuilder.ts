"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { apiClient } from "@/lib/api";
import { StackAnalysisResult, StackSupplement } from "@/types/stack";

const MAX_SUPPLEMENTS = 6;

export function useStackBuilder() {
  const [selectedSupplements, setSelectedSupplements] = useState<StackSupplement[]>([]);
  const [userGoal, setUserGoal] = useState<string>("");

  const addSupplement = useCallback((supplement: StackSupplement) => {
    setSelectedSupplements((prev) => {
      if (prev.length >= MAX_SUPPLEMENTS) return prev;
      if (prev.some((s) => s._id === supplement._id)) return prev;
      return [...prev, supplement];
    });
  }, []);

  const removeSupplement = useCallback((id: string) => {
    setSelectedSupplements((prev) => prev.filter((s) => s._id !== id));
  }, []);

  const clearStack = useCallback(() => {
    setSelectedSupplements([]);
  }, []);

  const analyzeMutation = useMutation<StackAnalysisResult, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.post<{ success: boolean; data: StackAnalysisResult }>(
        "/stack/analyze",
        {
          supplementIds: selectedSupplements.map((s) => s._id),
          userGoal,
        }
      );
      return response.data.data;
    },
  });

  const canAnalyze = selectedSupplements.length >= 2;

  return {
    selectedSupplements,
    userGoal,
    setUserGoal,
    addSupplement,
    removeSupplement,
    clearStack,
    canAnalyze,
    analyzeStack: analyzeMutation.mutate,
    analysisResult: analyzeMutation.data,
    isAnalyzing: analyzeMutation.isPending,
    analysisError: analyzeMutation.error,
    resetAnalysis: analyzeMutation.reset,
  };
}
