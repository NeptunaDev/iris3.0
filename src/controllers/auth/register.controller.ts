// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ClientModel from "@/models/Client.model";

const register = async (body: any) => {
  try {
    // Save new user
    const newClient = new ClientModel(body);
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
