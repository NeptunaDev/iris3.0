import { Repository } from "@/lib/Shared/domain/repository";
import { Client, ClientCreate, ClientUpdate } from "../domain/Client";
import { URI_API } from "@/configuration/config.client";
import { handleApiResponse, createApiError } from "@/lib/Shared/infrastructure/FetchRepository/utils";
import { APIResponse } from "@/lib/Shared/domain/response";
import { transformToSnakeCase, transformToCamelCase } from "@/lib/Shared/domain/caseUtils";

const API_ENDPOINTS = {
  clients: `${URI_API}/api/clients`,
} as const;

export const createClientFetchRepository = (): Repository<Client> => ({
  find: async (criteria?: Partial<Client>): Promise<APIResponse<Client[]>> => {
    try {
      const snakeCaseCriteria = criteria ? transformToSnakeCase(criteria) : undefined;
      const response = await fetch(API_ENDPOINTS.clients, {
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
      throw createApiError('Failed to fetch clients');
    }
  },

  create: async (clientCreate: ClientCreate): Promise<APIResponse<Client>> => {
    try {
      const snakeCaseClient = transformToSnakeCase(clientCreate);
      const response = await fetch(API_ENDPOINTS.clients, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseClient),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to create client');
    }
  },

  update: async (id: string, clientUpdate: ClientUpdate): Promise<APIResponse<Client>> => {
    try {
      const snakeCaseClient = transformToSnakeCase(clientUpdate);
      const response = await fetch(`${API_ENDPOINTS.clients}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseClient),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to update client');
    }
  },

  remove: async (id: string): Promise<APIResponse<void>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.clients}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<void>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to delete client');
    }
  },
});