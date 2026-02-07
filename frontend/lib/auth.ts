import { ApiResponse, User } from "../types";
import { apiClient } from "./api";

interface AuthResponseData {
  user: User;
  token: string;
}

/**
 * WHY: Centralize auth API calls for consistent request handling.
 */
export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    "/auth/register",
    {
      email,
      password,
      name,
    },
  );

  return response.data;
};

/**
 * WHY: Keep login logic reusable across pages and context.
 */
export const login = async (
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    "/auth/login",
    {
      email,
      password,
    },
  );

  return response.data;
};

/**
 * WHY: Fetch the authenticated user profile after token restoration.
 */
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>("/auth/profile");
  return response.data;
};
