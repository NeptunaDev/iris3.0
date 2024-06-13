// Import dependences
// External
import mongoose from "mongoose";
import { URI_DB_MONGO } from "./config";

// Connect to database
const connectDB = async () => {
  try {
    const db = await mongoose.connect(URI_DB_MONGO);
    console.log(`Database connected: ${db.connection.name}`);
  } catch (error: any) {
    console.log(error.message);
  }
};

// Export module
export default connectDB;
