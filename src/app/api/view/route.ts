// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import validateSchema from "@/middlewares/schema/validate.middleware";
import { CreateViewSchema } from "@/schemas/view/view.schema";
import { createView } from "@/controllers/view/view.controller";

export async function POST(req: Request) {
  try {
    // Get data
    const body = await req.json();

    // Validate schema
    const resValidateSchema = validateSchema(body, CreateViewSchema);
    if (resValidateSchema) return resValidateSchema;

    // Create view
    const res = await createView(body);
    if (res instanceof Error)
      return NextResponse.json(
        { error: res.message, status: 500 },
        { status: 500 }
      );

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
