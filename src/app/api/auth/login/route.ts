// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import validateSchema from "@/middlewares/schema/validate.middleware";
import { LoginClientSchema } from "@/schemas/auth/auth.schema";
import { login } from "@/controllers/auth/auth.controller";
import connectDB from "@/configuration/db";

connectDB();
export async function POST(req: Request) {
  try {
    // Get data
    const body = await req.json();

    // Validate schema
    const resValidateSchema = validateSchema(body, LoginClientSchema);
    if (resValidateSchema) return resValidateSchema;

    // Login client
    const res = await login(body);
    if (res instanceof Error)
      return NextResponse.json(
        { error: res.message, status: 500 },
        { status: 500 }
      );

    return res;
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
