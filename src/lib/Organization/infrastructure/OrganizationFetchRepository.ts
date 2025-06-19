import { URI_API } from "@/configuration/config.client";
import { APIResponse } from "@/lib/Shared/domain/response";
import { Repository } from "@/lib/Shared/domain/repository";
import { Organization, OrganizationCreate, OrganizationUpdate } from "../domain/Organization";
import { transformToCamelCase, transformToSnakeCase } from "@/lib/Shared/domain/caseUtils";
import { buildQueryString } from "@/lib/Shared/infrastructure/FetchRepository/queryUtils";
import { createApiError, handleApiResponse } from "@/lib/Shared/infrastructure/FetchRepository/utils";

const API_ENDPOINTS = {
  organizations: `${URI_API}organization/`
} as const;

export const createOrganizationFetchRepository = (): Repository<Organization> => ({
  find: async (criteria?: Partial<Organization>) => {
    const snakeCaseCriteria = criteria ? transformToSnakeCase(criteria) : undefined;
    const queryString = buildQueryString(snakeCaseCriteria);
    const URI = queryString ? `${API_ENDPOINTS.organizations}${queryString}` : API_ENDPOINTS.organizations;
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
      throw createApiError('Failed to fetch organizations');
    }
  },
  create: async (organizationCreate: OrganizationCreate) => {
    try {
      const snakeCaseOrganization = transformToSnakeCase(organizationCreate);
      const response = await fetch(API_ENDPOINTS.organizations, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseOrganization),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to create organization');
    }
  },
  update: async (id: string, organizationUpdate: OrganizationUpdate) => {
    try {
      const snakeCaseOrganization = transformToSnakeCase(organizationUpdate);
      const response = await fetch(`${API_ENDPOINTS.organizations}${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseOrganization),
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to update organization');
    }
  },
  remove: async (id: string): Promise<APIResponse<void>> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.organizations}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const apiResponse = await handleApiResponse<any>(response);
      return {
        ...apiResponse,
        data: transformToCamelCase(apiResponse.data)
      };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw createApiError('Failed to remove organization');
    }
  }
});