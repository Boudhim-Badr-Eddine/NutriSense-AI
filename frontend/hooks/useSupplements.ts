"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/AuthContext";
import { GetSupplementsParams, supplementsApi } from "@/lib/supplements";

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
  const { getProfile } = useAuth();
  return useMutation({
    mutationFn: supplementsApi.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements"] });
      void getProfile();
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
