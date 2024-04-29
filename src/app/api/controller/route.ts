// Import dependences
// External
import { NextRequest, NextResponse } from "next/server";

// Personal
import {
  createController,
  getController,
} from "@/controllers/controller/controller.controller";
import validateSchema from "@/middlewares/schema/validate.middleware";
import {
  CreateControllerSchema,
  GetControllerSchema,
} from "@/schemas/controller/controller.schema";
import { getQueries } from "@/utils/api/request/getQueries";

// Get controller
export async function GET(req: NextRequest) {
  try {
    // Get data
    const queries = getQueries(req);
    if (!("idClient" in queries)) {
      return NextResponse.json(
        { error: "idClient is required", status: 400 },
        { status: 400 }
      );
    }

    // Validate schema
    const resValidateSchema = validateSchema(queries, GetControllerSchema);
    if (resValidateSchema) return resValidateSchema;

    // Create controller
    const res = await getController(queries);
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

// Create controller
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
