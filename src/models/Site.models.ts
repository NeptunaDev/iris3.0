import { Model, Schema, model, models } from "mongoose";

export enum SiteType {
  MERAKI = "meraki",
  UBIQUITI = "ubiquiti",
}

export interface Site extends Document {
  idOrganization: Schema.Types.ObjectId;
  type: SiteType;
  siteId: string;
  name: string;
}

const SiteSchema = new Schema<Site>(
  {
    idOrganization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(SiteType),
      required: true,
    },
    siteId: {
      type: String,
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

const SiteModel =
  (models.Site as Model<Site>) || model<Site>("Site", SiteSchema);

export default SiteModel;
