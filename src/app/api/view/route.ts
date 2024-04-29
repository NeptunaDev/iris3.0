// Import dependences
// External
import { NextRequest, NextResponse } from "next/server";

// Personal
import validateSchema from "@/middlewares/schema/validate.middleware";
import { CreateViewSchema, GetViewSchema } from "@/schemas/view/view.schema";
import { createView, getView } from "@/controllers/view/view.controller";
import { getQueries } from "@/utils/api/request/getQueries";

export async function GET(req: NextRequest) {
  try {
    // Get Data
    const queries = getQueries(req);
    if (!("idController" in queries)) {
      return NextResponse.json(
        { error: "idController is required", status: 400 },
        { status: 400 }
      );
    }

    // Validate schema
    const resValidateSchema = validateSchema(queries, GetViewSchema);
    if (resValidateSchema) return resValidateSchema;

    const res = await getView(queries);
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
