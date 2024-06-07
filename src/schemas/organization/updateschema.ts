import Joi from "joi"

export interface UpdatedOrganization {
  name: string
}

const Update = Joi.object<UpdatedOrganization>({
  name: Joi.string()
    .required()
    .description("The name associated with the organization"),
})  

export default Update