// Import dependences
// External
import mongoose from "mongoose";

// Defined interface
export interface Client extends Document {
  name: string
  email: string
  password: string
}

// Create schema
const ClientSchema = new mongoose.Schema<Client>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},{
  timestamps: true
})

// Create model
const ClientModel = mongoose.models.Client as mongoose.Model<Client> || mongoose.model<Client>("Client", ClientSchema);

// Export model
export default ClientModel;