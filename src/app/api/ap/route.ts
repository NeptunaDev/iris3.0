import connectDB from "@/configuration/db";
import { createApController } from "@/controllers/ap/ap.controller";
import { validateMacIsUnique } from "@/middlewares/ap/ap.middleware";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { validateClientIsOwner } from "@/middlewares/site/site.middleware";
import { CreateApSchema } from "@/schemas/ap/ap.schema";
import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

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
    const resValidateSchema = validateSchema(body, CreateApSchema);
    if (resValidateSchema) return resValidateSchema;

    const resIsOwnerOfSite = await validateClientIsOwner(
      body.idSite,
      jwt as JwtPayload
    );
    if (resIsOwnerOfSite) return resIsOwnerOfSite;

    const apIsUnique = await validateMacIsUnique(body.mac);
    if (apIsUnique) return apIsUnique;

    const res = await createApController(body);
    return res;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
    }
  }
}
