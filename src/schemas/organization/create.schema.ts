import Joi from "joi"

export interface CreateOrganization {
  name: string
}

const Create = Joi.object<CreateOrganization>({
  name: Joi.string()
    .required()
    .description("The name associated with the organization"),
})  

export default Create