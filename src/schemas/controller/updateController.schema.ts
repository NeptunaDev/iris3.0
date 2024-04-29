// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Update {
  id: string;
  idCaptivePortal: string;
  ap: string;
  site: string;
}

// Update schema
const UpdateSchema = Joi.object<Update>({
  id: Joi.string()
    .required()
    .description("The id associated with the controller"),
  idCaptivePortal: Joi.string().description(
    "The idCaptivePortal associated with the controller"
  ),
  ap: Joi.string().description("The ap associated with the controller"),
  site: Joi.string().description("The site associated with the controller"),
});

// Export module
export { UpdateSchema };
