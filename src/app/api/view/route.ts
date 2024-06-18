// Import dependences
// External
import { NextRequest, NextResponse } from "next/server";

// Personal
import validateSchema from "@/middlewares/schema/validate.middleware";
import {
  CreateViewSchema,
  GetViewSchema,
  UpdateViewSchema,
} from "@/schemas/view/view.schema";
import {
  createView,
  getView,
  updateView,
} from "@/controllers/view/view.controller";
import { getQueries } from "@/utils/api/request/getQueries";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import { JwtPayload } from "jsonwebtoken";

// Get view
export async function GET(req: NextRequest) {
  try {
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );
    // Get Data
    const queries = getQueries(req);

    // Validate schema
    const resValidateSchema = validateSchema(queries, GetViewSchema);
    if (resValidateSchema) return resValidateSchema;

    const res = await getView(queries, jwt as JwtPayload);
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

// Create view
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

// Update view
export async function PUT(req: Request) {
  try {
    // Get data
    const body = await req.json();

    // Validate schema
    const resValidateSchema = validateSchema(body, UpdateViewSchema);
    if (resValidateSchema) return resValidateSchema;

    // Update view
    const res = await updateView(body);
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
