import { AuthRepository, LoginCredentials, AuthResponse } from "../domain/Auth";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      return await this.authRepository.login(credentials);
    } catch (error) {
      throw error;
    }
  }
} 