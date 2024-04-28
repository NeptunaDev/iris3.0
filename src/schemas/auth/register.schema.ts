// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

// Create schema
const RegisterUserSchema = Joi.object<RegisterUser>({
  name: Joi.string()
    .required()
    .description("The name associated with the API key"),
  email: Joi.string()
    .email()
    .required()
    .description("The email address associated with the API key"),
  password: Joi.string()
    .required()
    .description("The password associated with the API key"),
});

// Export module
export default RegisterUserSchema;
