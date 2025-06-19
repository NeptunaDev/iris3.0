import { View, ViewCreate, ViewUpdate } from "../domain/View";
import { URI_API } from "@/configuration/config.client";
import { APIResponse } from "@/lib/Shared/domain/response";
import { buildQueryString } from "@/lib/Shared/infrastructure/FetchRepository/queryUtils";
import { handleApiResponse, createApiError } from "@/lib/Shared/infrastructure/FetchRepository/utils";
import { transformToSnakeCase, transformToCamelCase } from "@/lib/Shared/domain/caseUtils";
import { ViewRepository } from "../domain/ViewRepository";
import { ViewSendEmail, ViewVerifyCode } from "../domain/ViewSpecification";

const API_ENDPOINTS = {
  views: `${URI_API}view/`,
} as const;

export const createViewFetchRepository = (token?: string): ViewRepository => ({
  find: async (criteria?: Partial<View>): Promise<APIResponse<View[] | number>> => {
    const snakeCaseCriteria = criteria ? transformToSnakeCase(criteria) : undefined;
    const queryString = buildQueryString(snakeCaseCriteria);
    const URI = queryString ? `${API_ENDPOINTS.views}${queryString}` : API_ENDPOINTS.views;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(URI, {
        method: 'GET',
        headers,
      });

      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to fetch views');
    }
  },

  create: async (view: ViewCreate): Promise<APIResponse<View>> => {
    try {
      const snakeCaseView = transformToSnakeCase(view);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(API_ENDPOINTS.views, {
        method: 'POST',
        headers,
        body: JSON.stringify(snakeCaseView),
      });

      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to create view');
    }
  },

  sendEmail: async (viewSendEmail: ViewSendEmail): Promise<APIResponse<void>> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_ENDPOINTS.views}/send-email`, {
        method: 'POST',
        headers,
        body: JSON.stringify(transformToSnakeCase(viewSendEmail)),
      });

      return handleApiResponse<void>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to send email');
    }
  },

  verifyCode: async (viewVerifyCode: ViewVerifyCode): Promise<APIResponse<void>> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_ENDPOINTS.views}/verify-code`, {
        method: 'POST',
        headers,
        body: JSON.stringify(transformToSnakeCase(viewVerifyCode)),
      });

      return handleApiResponse<void>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to verify code');
    }
  },

  update: async (id: string, view: ViewUpdate): Promise<APIResponse<View>> => {
    try {
      const snakeCaseView = transformToSnakeCase(view);
      const response = await fetch(`${API_ENDPOINTS.views}${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseView),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to update view');
    }
  },

  remove: async (id: string): Promise<APIResponse<void>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.views}${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<void>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to delete view');
    }
  }
}); 