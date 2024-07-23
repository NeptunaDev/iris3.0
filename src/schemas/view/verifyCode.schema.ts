import Joi from "joi";

export interface VerifyCode {
  code: string;
  id_view: string;
}

export const VerifyCodeSchema = Joi.object<VerifyCode>({
  code: Joi.string().required().description("The code to verify the view"),
  id_view: Joi.string()
    .required()
    .description("The id associated with the view"),
});
