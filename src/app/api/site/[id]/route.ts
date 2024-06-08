import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

import connectDB from "@/configuration/db";
import { updateSiteController } from "@/controllers/site/site.controller";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import validateSchema from "@/middlewares/schema/validate.middleware";
import {
  validateClientIsOwner,
  validateUniqueSiteId,
  validateUpdateType,
} from "@/middlewares/site/site.middleware";
import { UpdateSiteSchema } from "@/schemas/site/site.schema";

interface Params {
  params: {
    id: string;
  };
}

connectDB();
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );

    const body = await req.json();
    const resValidateSchema = validateSchema(body, UpdateSiteSchema);
    if (resValidateSchema) return resValidateSchema;

    const resIsOwner = await validateClientIsOwner(id, jwt as JwtPayload);
    if (resIsOwner) return resIsOwner;

    if (body.siteId) {
      const resUniqueSiteId = await validateUniqueSiteId(body.siteId);
      if (resUniqueSiteId) return resUniqueSiteId;
    }

    if (body.type) {
      const resUpdateType = await validateUpdateType(body, id);
      if (resUpdateType) return resUpdateType;
    }

    const res = await updateSiteController(body, id);
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
