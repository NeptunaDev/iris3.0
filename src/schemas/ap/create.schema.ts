import Joi from "joi";

export interface CreateAp {
  idSite: string;
  mac: string;
  name: string;
}

export const Create = Joi.object<CreateAp>({
  idSite: Joi.string()
    .required()
    .description("The id of the site associated with the AP"),
  mac: Joi.string().required().description("The mac address of the AP"),
  name: Joi.string().required().description("The name of the AP"),
});
