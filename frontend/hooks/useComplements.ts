"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/AuthContext";
import { complementsApi, GetComplementsParams } from "@/lib/complements";

/**
 * WHY: Fetch complements with caching and pagination support.
 */
export const useComplements = (params?: GetComplementsParams) => {
  return useQuery({
    queryKey: ["complements", params],
    queryFn: () => complementsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * WHY: Retrieve a single complement record on demand.
 */
export const useComplement = (id: string) => {
  return useQuery({
    queryKey: ["complement", id],
    queryFn: () => complementsApi.getById(id),
    enabled: Boolean(id),
  });
};

/**
 * WHY: Toggle a complement favorite and refresh cached lists and user profile.
 */
export const useToggleComplementFavorite = () => {
  const queryClient = useQueryClient();
  const { getProfile } = useAuth();
  return useMutation({
    mutationFn: complementsApi.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complements"] });
      void getProfile();
    },
  });
};

/**
 * WHY: Execute server-side search when query length is meaningful.
 */
export const useSearchComplements = (query: string) => {
  return useQuery({
    queryKey: ["complements", "search", query],
    queryFn: () => complementsApi.search(query),
    enabled: query.length > 2,
  });
};
