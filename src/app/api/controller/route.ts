import { createController } from "@/controllers/controller/controller.controller";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { CreateControllerSchema } from "@/schemas/controller/controller.schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get data
    const body = await req.json();

    // Validate schema
    const resValidateSchema = validateSchema(body, CreateControllerSchema);
    if (resValidateSchema) return resValidateSchema;

    // Create controller
    const res = await createController(body);
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
