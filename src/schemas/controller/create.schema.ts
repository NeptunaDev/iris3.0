// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Create {
  idClient: string;
  idCaptivePortal: string;
  ap: string;
  site: string;
}

// Create schema
const CreateSchema = Joi.object<Create>({
  idClient: Joi.string()
    .required()
    .description("The idClient associated with the controller"),
  idCaptivePortal: Joi.string().description(
    "The idCaptivePortal associated with the controller"
  ),
  ap: Joi.string()
    .required()
    .description("The ap associated with the controller"),
  site: Joi.string()
    .required()
    .description("The site associated with the controller"),
});

// Export module
export { CreateSchema };
