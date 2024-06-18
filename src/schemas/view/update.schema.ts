// Import dependences
// External
import { Info } from "@/models/View.model";
import Joi from "joi";

// Defined interface
export interface Update {
  id: string;
  isLogin: boolean;
  info: Array<Info>;
}

// Update schema
const UpdateSchema = Joi.object<Update>({
  id: Joi.string().required().description("The id associated with the view"),
  isLogin: Joi.boolean().description("The isLogin associated with the view"),
  info: Joi.array().items(
    Joi.object({
      label: Joi.string().description("The label associated with the view"),
      value: Joi.string().description("The value associated with the view"),
      type: Joi.string().description("The type associated with the view"),
    })
  ),
});

// Export module
export { UpdateSchema };
