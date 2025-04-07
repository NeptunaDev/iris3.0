import { AP, APCreate, APUpdate } from "../domain/AP";
import { URI_API } from "@/configuration/config.client";
import { Repository } from "@/lib/Shared/domain/repository";
import { APIResponse } from "@/lib/Shared/domain/response";
import { buildQueryString } from "@/lib/Shared/infrastructure/FetchRepository/queryUtils";
import { handleApiResponse, createApiError } from "@/lib/Shared/infrastructure/FetchRepository/utils";
import { transformToSnakeCase, transformToCamelCase } from "@/lib/Shared/domain/caseUtils";

const API_ENDPOINTS = {
  aps: `${URI_API}/ap/`,
} as const;

export const createAPFetchRepository = (): Repository<AP> => ({
  find: async (criteria?: Partial<AP>): Promise<APIResponse<AP[]>> => {
    const snakeCaseCriteria = criteria ? transformToSnakeCase(criteria) : undefined;
    const queryString = buildQueryString(snakeCaseCriteria);
    const URI = queryString ? `${API_ENDPOINTS.aps}${queryString}` : API_ENDPOINTS.aps;
    try {
      const response = await fetch(URI, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const apiResponse = await handleApiResponse<any[]>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to fetch APs');
    }
  },

  create: async (ap: APCreate): Promise<APIResponse<AP>> => {
    try {
      const snakeCaseAp = transformToSnakeCase(ap);
      const response = await fetch(API_ENDPOINTS.aps, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseAp),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to create AP');
    }
  },

  update: async (id: string, ap: APUpdate): Promise<APIResponse<AP>> => {
    try {
      const snakeCaseAp = transformToSnakeCase(ap);
      const response = await fetch(`${API_ENDPOINTS.aps}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseAp),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to update AP');
    }
  },

  remove: async (id: string): Promise<APIResponse<void>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.aps}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<void>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to delete AP');
    }
  },
}); 