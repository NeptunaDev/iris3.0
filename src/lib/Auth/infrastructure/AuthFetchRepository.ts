import { AuthRepository, LoginCredentials, AuthResponse } from "../domain/Auth";
import { URI_API } from "@/configuration/config.client";
import { handleApiResponse, createApiError } from "@/lib/Shared/infrastructure/FetchRepository/utils";

const API_ENDPOINTS = {
  auth: `${URI_API}auth/`,
} as const;

export const createAuthFetchRepository = (): AuthRepository => ({
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.auth}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleApiResponse<AuthResponse['data']>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to login');
    }
  },
}); 