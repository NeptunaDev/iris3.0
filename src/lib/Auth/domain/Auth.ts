export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

export interface AuthResponse {
  message: string;
  status: number;
  data: AuthToken;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
} 