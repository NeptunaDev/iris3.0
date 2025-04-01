import { Site, SiteCreate, SiteUpdate } from "../domain/Site";
import { URI_API } from "@/configuration/config";
import { Repository } from "@/lib/Shared/domain/repository";
import { APIResponse } from "@/lib/Shared/domain/response";
import { buildQueryString } from "@/lib/Shared/infrastructure/FetchRepository/queryUtils";
import { handleApiResponse, createApiError } from "@/lib/Shared/infrastructure/FetchRepository/utils";
import { transformToSnakeCase, transformToCamelCase } from "@/lib/Shared/domain/caseUtils";

const API_ENDPOINTS = {
  sites: `${URI_API}/site`,
} as const;

export const createSiteFetchRepository = (): Repository<Site> => ({
  find: async (criteria?: Partial<Site>): Promise<APIResponse<Site[]>> => {
    const snakeCaseCriteria = criteria ? transformToSnakeCase(criteria) : undefined;
    const queryString = buildQueryString(snakeCaseCriteria);
    const URI = queryString ? `${API_ENDPOINTS.sites}${queryString}` : API_ENDPOINTS.sites;
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
      throw createApiError('Failed to fetch sites');
    }
  },

  create: async (site: SiteCreate): Promise<APIResponse<Site>> => {
    try {
      const snakeCaseSite = transformToSnakeCase(site);
      const response = await fetch(API_ENDPOINTS.sites, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseSite),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to create site');
    }
  },

  update: async (id: string, site: SiteUpdate): Promise<APIResponse<Site>> => {
    try {
      const snakeCaseSite = transformToSnakeCase(site);
      const response = await fetch(`${API_ENDPOINTS.sites}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseSite),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to update site');
    }
  },

  remove: async (id: string): Promise<APIResponse<void>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.sites}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<void>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to delete site');
    }
  },
}); 