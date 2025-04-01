import { APIResponse, FetchRepositoryError } from './types';

export const handleApiResponse = async <T>(response: Response): Promise<APIResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new FetchRepositoryError(
      errorData.message || 'An error occurred while processing your request',
      response.status,
      errorData.code
    );
  }
  return response.json();
};

export const createApiError = (message: string, status?: number, code?: string): FetchRepositoryError => {
  return new FetchRepositoryError(message, status, code);
}; 