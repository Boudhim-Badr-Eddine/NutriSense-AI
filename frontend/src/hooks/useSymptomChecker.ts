"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";

import { SymptomCheckResponse } from "../types/symptom";

interface SymptomCheckPayload {
  symptoms: string[];
}

const checkSymptomsRequest = async (
  symptoms: string[],
): Promise<SymptomCheckResponse> => {
  const payload: SymptomCheckPayload = { symptoms };
  const response = await apiClient.post<SymptomCheckResponse>(
    "/symptoms/check",
    payload,
  );

  return response.data;
};

/**
 * WHY: Encapsulate symptom checker mutation logic for reuse across UI components.
 */
export const useSymptomChecker = (): UseMutationResult<
  SymptomCheckResponse,
  Error,
  string[]
> => {
  return useMutation<SymptomCheckResponse, Error, string[]>({
    mutationFn: checkSymptomsRequest,
  });
};
