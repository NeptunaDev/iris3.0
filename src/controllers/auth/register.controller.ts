// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ClientModel from "@/models/Client.model";
import { encryptText } from "@/utils/crypto/crypto";
import connectDB from "@/configuration/db";

connectDB();
const register = async (body: any) => {
  try {
    // Save new user
    const newClient = new ClientModel({...body, password: encryptText(body.password)});
    const client = await newClient.save();

    // Return response
    return NextResponse.json(
      {
        message: "Client registered successfully",
        status: 200,
        data: client,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export default register;
