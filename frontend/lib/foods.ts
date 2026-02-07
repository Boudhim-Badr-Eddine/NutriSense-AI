import type { ApiResponse, Food } from "@/types";
import { api } from "./api";

export interface GetFoodsParams {
  search?: string;
  category?: string;
  type?: string;
  diet?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * WHY: Consolidate foods API calls for nutrition views.
 */
export const foodsApi = {
  getAll: async (params?: GetFoodsParams) => {
    const { data } = await api.get<ApiResponse<Food[]>>("/foods", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Food>>(`/foods/${id}`);
    return data.data;
  },

  getTopProteins: async (limit = 20) => {
    const { data } = await api.get<ApiResponse<Food[]>>(
      "/foods/rankings/proteins",
      {
        params: { limit },
      },
    );
    return data.data;
  },

  getTopCarbs: async (limit = 20) => {
    const { data } = await api.get<ApiResponse<Food[]>>(
      "/foods/rankings/carbs",
      {
        params: { limit },
      },
    );
    return data.data;
  },

  getTopFats: async (limit = 20) => {
    const { data } = await api.get<ApiResponse<Food[]>>(
      "/foods/rankings/fats",
      {
        params: { limit },
      },
    );
    return data.data;
  },

  toggleFavorite: async (id: string) => {
    const { data } = await api.post<ApiResponse<unknown>>(`/foods/${id}/favorite`);
    return data;
  },
};
