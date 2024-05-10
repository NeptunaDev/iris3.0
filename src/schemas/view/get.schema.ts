// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Get {
  _id: string;
  idController: string;
  ap: string;
  isLogin: boolean;
}

// Get schema
const GetSchema = Joi.object<Get>({
  _id: Joi.string().description("The id associated with the view"),
  idController: Joi.string().description(
    "The idController associated with the view"
  ),
  ap: Joi.string().description("The ap associated with the view"),
  isLogin: Joi.boolean().description("The isLogin associated with the view"),
});

// Export module
export { GetSchema };