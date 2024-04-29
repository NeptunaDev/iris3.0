// Import dependences
// External
import mongoose from "mongoose";

// Defined interface Info
export interface Info {
  label: string
  value: string
  type: string
}

// Defined interface View
export interface View extends Document {
  idController: mongoose.Schema.Types.ObjectId;
  ap: string;
  isLogin: boolean;
  info: Array<Info>;
}

// Create schema
const ViewSchema = new mongoose.Schema<View>(
  {
    idController: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Controller",
      required: true,
    },
    ap: {
      type: String,
      required: true,
      unique: true,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Array<Info>(),
      required: true,
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