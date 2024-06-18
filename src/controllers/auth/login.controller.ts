// Import dependences
// External
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Personal
import ClientModel from "@/models/Client.model";
import { encryptText } from "@/utils/crypto/crypto";

const login = async (body: any) => {
  try {
    // Get data
    const { email, password } = body;
    const passwordEncrypted = encryptText(password);

    // Find client
    const client = await ClientModel.findOne({ email, password: passwordEncrypted });

    // Validate client
    if (!client) {
      return NextResponse.json(
        { error: "Client not found", status: 404 },
        { status: 404 }
      );
    }

    // Create token
    const TOKEN_SECRET: string | undefined = process.env.TOKEN_SECRET;
    if (!TOKEN_SECRET)
      throw new Error("TOKEN_SECRET is not defined in .env file");
    const token = jwt.sign({ 
      id: client._id,
      name: client.name,
     }, TOKEN_SECRET, {
      expiresIn: "24h",
    });

    // Return response
    return NextResponse.json(
      {
        message: "Client logged successfully",
        status: 200,
        data: { token },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export default login;
