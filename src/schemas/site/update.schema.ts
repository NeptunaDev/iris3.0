import Joi from "joi";
import { CreateSite } from "./create.schema";
import { SiteType } from "@/models/Site.models";

interface UpdateSite extends Omit<CreateSite, "idOrganization"> {}

export const Update = Joi.object<UpdateSite>({
  type: Joi.string()
    .valid(...Object.values(SiteType))
    .description("The type of the site"),
  siteId: Joi.string().description("The site id"),
  name: Joi.string().description("The name associated with the site"),
});
