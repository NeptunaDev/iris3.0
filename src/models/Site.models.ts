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
  host: string;
  port: string;
  username: string;
  password: string;
  sslverify: boolean;
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
    },
    host: {
      type: String,
    },
    port: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    sslverify: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const SiteModel =
  (models.Site as Model<Site>) || model<Site>("Site", SiteSchema);

export default SiteModel;
