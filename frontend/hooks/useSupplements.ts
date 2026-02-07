"use client";

import { GetSupplementsParams, supplementsApi } from "@/lib/supplements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSupplements = (params?: GetSupplementsParams) => {
  return useQuery({
    queryKey: ["supplements", params],
    queryFn: () => supplementsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSupplement = (id: string) => {
  return useQuery({
    queryKey: ["supplement", id],
    queryFn: () => supplementsApi.getById(id),
    enabled: !!id,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplementsApi.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements"] });
    },
  });
};

export const useSearchSupplements = (query: string) => {
  return useQuery({
    queryKey: ["supplements", "search", query],
    queryFn: () => supplementsApi.search(query),
    enabled: query.length > 2,
  });
};
