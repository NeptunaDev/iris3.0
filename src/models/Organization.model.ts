import { Model, Schema, model, models } from "mongoose";

export interface Organization extends Document {
  idClient: Schema.Types.ObjectId;
  name: string;
}

const OrganizationSchema = new Schema<Organization>(
  {
    idClient: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrganizationModel = (models.Organization as Model<Organization>) || model<Organization>("Organization", OrganizationSchema);

export default OrganizationModel;
