// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Create {
  idController: string;
  ap: string;
}

// Create schema
const CreateSchema = Joi.object<Create>({
  idController: Joi.string()
    .required()
    .description("The idController associated with the view"),
  ap: Joi.string()
    .required()
    .description("The ap associated with the view"),
});

// Export module
export { CreateSchema };

