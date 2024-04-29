// Import dependences
// External
import mongoose from "mongoose";

// Defined interface
export interface Controller extends Document {
  idClient: mongoose.Schema.Types.ObjectId;
  idCaptivePortal: string;
  ap: string;
  site: string;
}

// Create schema
const ControllertSchema = new mongoose.Schema<Controller>(
  {
    idClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    idCaptivePortal: {
      type: String,
      default: "default",
    },
    ap: {
      type: String,
      required: true,
      unique: true,
    },
    site: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const ControllerModel =
  (mongoose.models.Controller as mongoose.Model<Controller>) ||
  mongoose.model<Controller>("Controller", ControllertSchema);

// Export model
export default ControllerModel ;
