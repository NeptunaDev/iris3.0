// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Get {
  _id: string;
  idAp: string;
  mac: string;
  isLogin: boolean;
}

// Get schema
const GetSchema = Joi.object<Get>({
  _id: Joi.string().description("The id associated with the view"),
  idAp: Joi.string().description(
    "The idAp associated with the view"
  ),
  mac: Joi.string().description("The mac associated with the view"),
  isLogin: Joi.boolean().description("The isLogin associated with the view"),
});

// Export module
export { GetSchema };