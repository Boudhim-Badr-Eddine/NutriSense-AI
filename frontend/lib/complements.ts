import type { ApiResponse, Complement } from "@/types";
import { api } from "./api";

export interface GetComplementsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * WHY: Centralize complements API calls for consistent request handling.
 */
export const complementsApi = {
  getAll: async (params?: GetComplementsParams) => {
    const { data } = await api.get<ApiResponse<Complement[]>>("/complements", {
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Complement>>(
      `/complements/${id}`,
    );
    return data.data;
  },

  search: async (query: string) => {
    const { data } = await api.get<ApiResponse<Complement[]>>(
      "/complements/search",
      {
        params: { search: query },
      },
    );
    return data;
  },

  toggleFavorite: async (id: string) => {
    const { data } = await api.post<ApiResponse<unknown>>(
      `/complements/${id}/favorite`,
    );
    return data;
  },
};
