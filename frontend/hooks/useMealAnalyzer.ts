"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { apiClient } from "@/lib/api";
import { MealAnalysisResult } from "@/types/mealAnalyzer";

interface UseMealAnalyzerResult {
  previewUrl: string | null;
  setImagePreview: (file: File) => void;
  clearImage: () => void;
  analyzeMealPhoto: (file: File) => void;
  analysisResult: MealAnalysisResult | undefined;
  isAnalyzing: boolean;
  analysisError: Error | null;
  resetAnalysis: () => void;
}

export function useMealAnalyzer(): UseMealAnalyzerResult {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mutation = useMutation<MealAnalysisResult, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post<{
        success: boolean;
        data: MealAnalysisResult;
      }>("/meal-analyzer/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    },
  });

  const clearImage = useCallback(() => {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }, []);

  const setImagePreview = useCallback((file: File) => {
    const nextUrl = URL.createObjectURL(file);

    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return nextUrl;
    });
  }, []);

  return {
    previewUrl,
    setImagePreview,
    clearImage,
    analyzeMealPhoto: mutation.mutate,
    analysisResult: mutation.data,
    isAnalyzing: mutation.isPending,
    analysisError: mutation.error,
    resetAnalysis: mutation.reset,
  };
}
