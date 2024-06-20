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
  host: Joi.string().description("The host of the site"),
  port: Joi.string().description("The port of the site"),
  username: Joi.string().description("The username of the site"),
  password: Joi.string().description("The password of the site"),
  sslverify: Joi.boolean().description("The sslverify of the site"),
});
