import Joi from "joi";
import { CreateAp } from "./create.schema";

export interface UpdateAp extends Omit<CreateAp, "idSite" | "mac"> {}

export const Update = Joi.object<UpdateAp>({
  idSite: Joi.string().description("The id of the site associated with the AP"),
  mac: Joi.string().description("The mac address of the AP"),
  name: Joi.string().description("The name of the AP"),
});
