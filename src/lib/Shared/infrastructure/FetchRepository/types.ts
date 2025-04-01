import { APIResponse, ApiError, RepositoryError } from '@/lib/Shared/domain/response';

export type { APIResponse, ApiError };

export class FetchRepositoryError extends RepositoryError {
  constructor(
    message: string,
    status?: number,
    code?: string
  ) {
    super(message, status, code);
    this.name = 'FetchRepositoryError';
  }
} 