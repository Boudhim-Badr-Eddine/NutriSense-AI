"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { foodsApi, GetFoodsParams } from "@/lib/foods";

/**
 * WHY: Fetch foods with optional filters.
 */
export const useFoods = (params?: GetFoodsParams) => {
  return useQuery({
    queryKey: ["foods", params],
    queryFn: () => foodsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * WHY: Retrieve a single food record by id.
 */
export const useFood = (id: string) => {
  return useQuery({
    queryKey: ["food", id],
    queryFn: () => foodsApi.getById(id),
    enabled: Boolean(id),
  });
};

/**
 * WHY: Pull top protein sources for ranking views.
 */
export const useTopProteins = () => {
  return useQuery({
    queryKey: ["foods", "top-proteins"],
    queryFn: () => foodsApi.getTopProteins(),
  });
};

/**
 * WHY: Pull top carbohydrate sources for ranking views.
 */
export const useTopCarbs = () => {
  return useQuery({
    queryKey: ["foods", "top-carbs"],
    queryFn: () => foodsApi.getTopCarbs(),
  });
};

/**
 * WHY: Pull top fat sources for ranking views.
 */
export const useTopFats = () => {
  return useQuery({
    queryKey: ["foods", "top-fats"],
    queryFn: () => foodsApi.getTopFats(),
  });
};

/**
 * WHY: Toggle a food favorite and refresh cached lists.
 */
export const useToggleFoodFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: foodsApi.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      queryClient.invalidateQueries({ queryKey: ["food"] });
    },
  });
};
