// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface LoginClient {
  email: string;
  password: string;
}

// Create schema
const LoginClientSchema = Joi.object<LoginClient>({
  email: Joi.string()
    .email()
    .required()
    .description("The email address associated with the API key"),
  password: Joi.string()
    .required()
    .description("The password associated with the API key"),
});

// Export module
export default LoginClientSchema;
