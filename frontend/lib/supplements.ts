import type { ApiResponse, Supplement } from '@/types';
import { api } from './api';

export interface GetSupplementsParams {
  search?: string;
  category?: string;
  goal?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const supplementsApi = {
  getAll: async (params?: GetSupplementsParams) => {
    const { data } = await api.get<ApiResponse<Supplement[]>>('/supplements', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Supplement>>(`/supplements/${id}`);
    return data.data;
  },

  search: async (query: string) => {
    const { data } = await api.get<ApiResponse<Supplement[]>>('/supplements/search', {
      params: { search: query },
    });
    return data;
  },

  toggleFavorite: async (id: string) => {
    const { data } = await api.post<ApiResponse<unknown>>(`/supplements/${id}/favorite`);
    return data;
  },
};
