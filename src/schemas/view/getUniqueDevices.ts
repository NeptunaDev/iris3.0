import Joi from "joi"

export interface GetUniqueDevices{
  startDate: string;
  endDate: string;
}

const GetUniqueDevicesSchema = Joi.object<GetUniqueDevices>({
  startDate: Joi.string().description("The startDate associated with the view"),
  endDate: Joi.string().description("The endDate associated with the view"),
});

export { GetUniqueDevicesSchema };