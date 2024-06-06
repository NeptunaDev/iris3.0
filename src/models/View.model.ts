// Import dependences
// External
import mongoose, { Schema } from "mongoose";

// Defined interface Info
export interface Info {
  label: string
  value: string
  type: string
}

// Defined interface View
export interface View extends Document {
  idAp: mongoose.Schema.Types.ObjectId
  mac: string
  isLogin: boolean
  info: Array<Info>
}

// Create schema
const ViewSchema = new mongoose.Schema<View>(
  {
    idAp: {
      type: Schema.Types.ObjectId,
      ref: "AP",
      required: true,
      index: true,
    },
    mac: {
      type: String,
      required: true,
      index: true,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Array<Info>(),
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const ViewModel =
  (mongoose.models.View as mongoose.Model<View>) ||
  mongoose.model<View>("View", ViewSchema);

// Export model
export default ViewModel;