// Import dependences
// External
import { NextRequest, NextResponse } from "next/server";

// Personal
import { getUniqueDevicesView } from "@/controllers/view/view.controller";
import { getQueries } from "@/utils/api/request/getQueries";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import { JwtPayload } from "jsonwebtoken";
import validateSchema from "@/middlewares/schema/validate.middleware";
import {GetUniqueDevicesSchema} from "@/schemas/view/getUniqueDevices";

// Get view
export async function GET(req: NextRequest) {
  try {
    // Get Data
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );

    const queries = getQueries(req);
    // Validate schema
    const resValidateSchema = validateSchema(queries, GetUniqueDevicesSchema);
    if (resValidateSchema) return resValidateSchema;

    const res = await getUniqueDevicesView(queries, jwt as JwtPayload);
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