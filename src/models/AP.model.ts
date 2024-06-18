import { Model, Schema, model, models } from "mongoose";

export interface AP extends Document {
  idSite: Schema.Types.ObjectId;
  mac: string;
  name: string;
}

const APSchema = new Schema<AP>(
  {
    idSite: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    mac: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

const APModel = (models.AP as Model<AP>) || model<AP>("AP", APSchema);

export default APModel;
