import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import connectDB from "@/configuration/db";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { CreateSiteSchema } from "@/schemas/site/site.schema";
import { clientIsOwnerOfProject } from "@/middlewares/organization/organization.middleware";
import {
  createSiteController,
  readSiteController,
} from "@/controllers/site/site.controller";
import { validateUniqueSiteId } from "@/middlewares/site/site.middleware";

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
    const resValidateSchema = validateSchema(body, CreateSiteSchema);
    if (resValidateSchema) return resValidateSchema;

    const isOwner = await clientIsOwnerOfProject(
      jwt as JwtPayload,
      body.idOrganization
    );
    if (isOwner instanceof Error)
      return NextResponse.json(
        { error: isOwner.message, status: 403 },
        { status: 403 }
      );
    if (body.siteId) {
      const resUniqueSiteId = await validateUniqueSiteId(body.siteId);
      if (resUniqueSiteId) return resUniqueSiteId;
    }

    const res = await createSiteController(body);
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

export async function GET(req: Request) {
  try {
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );
    const res = await readSiteController(jwt as JwtPayload);
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
