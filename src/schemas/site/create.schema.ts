import { SiteType } from "@/models/Site.models";
import Joi from "joi";

export interface CreateSite {
  idOrganization: string;
  type: SiteType;
  siteId?: string;
  name: string;
  host: string;
  port: string;
  username: string;
  password: string;
  sslverify: boolean;
}

export const Create = Joi.object<CreateSite>({
  idOrganization: Joi.string()
    .required()
    .description("The id of the organization"),
  type: Joi.string()
    .valid(...Object.values(SiteType))
    .required()
    .description("The type of the site"),
  siteId: Joi.string().when("type", {
    is: SiteType.UBIQUITI,
    then: Joi.required().description("The site id (required for ubiquiti)"),
    otherwise: Joi.forbidden().description("The site id (optional for meraki)"),
  }),
  name: Joi.string()
    .required()
    .description("The name associated with the site"),
  host: Joi.string()
    .required()
    .description("The host of the site"),
  port: Joi.string()
    .required()
    .description("The port of the site"),
  username: Joi.string()
    .required()
    .description("The username of the site"),
  password: Joi.string()
    .required()
    .description("The password of the site"),
  sslverify: Joi.boolean()
    .required()
    .description("The sslverify of the site"),
});
