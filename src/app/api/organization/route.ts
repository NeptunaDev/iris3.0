import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

import connectDB from "@/configuration/db";
import { createOrganization } from "@/controllers/organization/organization.controller";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { CreateOrganizationSchema } from "@/schemas/organization/organization.schema";

connectDB();
export async function POST(req: Request) {
  try {
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );

    const body = await req.json();
    const resValidateSchema = validateSchema(body, CreateOrganizationSchema);
    if (resValidateSchema) return validateSchema;

    const res = await createOrganization(body, jwt as JwtPayload);
    if (res instanceof Error)
      return NextResponse.json(
        { error: res.message, status: 500 },
        { status: 500 }
      );

    return res;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
