import Joi from "joi";

export interface Send {
  id_view: string;
  template: string;
  email: string;
}

export const SendSchema = Joi.object<Send>({
  id_view: Joi.string().required().description("The id associated with the view"),
  template: Joi.string().required().description("The template associated with the view"),
  email: Joi.string().email().required().description("The email to send the view"),
});