// Import dependences
// External
import mongoose from "mongoose";

// Connect to database
const connectDB = async () => {
  try {
    const URI: string | undefined = process.env.URI_DB_MONGO;
    if (!URI) throw new Error("URI_DB_MONGO is not defined in .env file");

    const db = await mongoose.connect(URI);
    console.log(`Database connected: ${db.connection.name}`);
  } catch (error) {
    console.log(error);
  }
};

// Export module
export default connectDB;