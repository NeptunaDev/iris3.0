// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Create {
  idAp: string;
  mac: string;
}

// Create schema
const CreateSchema = Joi.object<Create>({
  idAp: Joi.string()
    .required()
    .description("The idController associated with the view"),
  mac: Joi.string()
    .required()
    .description("The ap associated with the view"),
});

// Export module
export { CreateSchema };

