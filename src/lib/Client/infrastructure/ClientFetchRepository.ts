import { Repository } from "@/lib/Shared/domain/repository";
import { Client, ClientCreate, ClientUpdate } from "../domain/Client";
import { URI_API } from "@/configuration/config";
import { handleApiResponse, createApiError } from "@/lib/Shared/infrastructure/FetchRepository/utils";
import { APIResponse } from "@/lib/Shared/domain/response";

const API_ENDPOINTS = {
  clients: `${URI_API}/api/clients`,
} as const;

export const createClientFetchRepository = (): Repository<Client> => ({
  find: async (criteria?: Partial<Client>): Promise<APIResponse<Client[]>> => {
    try {
      const response = await fetch(API_ENDPOINTS.clients, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<Client[]>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to fetch clients');
    }
  },

  create: async (clientCreate: ClientCreate): Promise<APIResponse<Client>> => {
    try {
      const response = await fetch(API_ENDPOINTS.clients, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientCreate),
      });
      return handleApiResponse<Client>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to create client');
    }
  },

  update: async (id: string, clientUpdate: ClientUpdate): Promise<APIResponse<Client>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.clients}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientUpdate),
      });
      return handleApiResponse<Client>(response);
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