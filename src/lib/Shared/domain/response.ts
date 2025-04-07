export interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export class RepositoryError extends Error implements ApiError {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
} 