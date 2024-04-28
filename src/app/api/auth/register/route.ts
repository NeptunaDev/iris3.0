// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import { register } from "@/controllers/auth/auth.controller";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { RegisterUserSchema } from "@/schemas/auth/auth.schema";

export async function POST(req: Request) {
  try {
    // Get data
    const body = await req.json();

    // Validate schema
    const resValidateSchema = validateSchema(body, RegisterUserSchema);
    if (resValidateSchema) return resValidateSchema;

    // Register user
    const res = await register(body);
    if (res instanceof Error)
      return NextResponse.json(
        { error: res.message, status: 500 },
        { status: 500 }
      );

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
