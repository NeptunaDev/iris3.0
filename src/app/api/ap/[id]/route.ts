import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import connectDB from "@/configuration/db";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { UpdateApSchema } from "@/schemas/ap/ap.schema";
import { validateClientIsOwner } from "@/middlewares/site/site.middleware";
import {
  validateClientIsOwnerOfAp,
  validateMacIsUnique,
} from "@/middlewares/ap/ap.middleware";
import { updateApController } from "@/controllers/ap/ap.controller";

interface Params {
  params: {
    id: string;
  };
}

connectDB();
export async function PATCH(req: Request, { params }: Params) {
  try {
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );

    const body = await req.json();
    const resValidateSchema = validateSchema(body, UpdateApSchema);
    if (resValidateSchema) return resValidateSchema;

    const resValidateIsOwner = await validateClientIsOwnerOfAp(
      params.id,
      jwt as JwtPayload
    );
    if (resValidateIsOwner) return resValidateIsOwner;

    if (body.idSite) {
      const resIsOwnerOfSite = await validateClientIsOwner(
        body.idSite,
        jwt as JwtPayload
      );
      if (resIsOwnerOfSite) return resIsOwnerOfSite;
    }

    if (body.mac) {
      const apIsUnique = await validateMacIsUnique(body.mac);
      if (apIsUnique) return apIsUnique;
    }

    const res = await updateApController(params.id, body);
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
