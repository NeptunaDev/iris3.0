// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Get {
  id: string;
  idClient: string;
  idCaptivePortal: string;
  ap: string;
  site: string;
}

// Get schema
const GetSchema = Joi.object<Get>({
  id: Joi.string().description("The id associated with the controller"),
  idClient: Joi.string().description(
    "The idClient associated with the controller"
  ),
  idCaptivePortal: Joi.string().description(
    "The idCaptivePortal associated with the controller"
  ),
  ap: Joi.string().description("The ap associated with the controller"),
  site: Joi.string().description("The site associated with the controller"),
});

// Export module
export { GetSchema };
