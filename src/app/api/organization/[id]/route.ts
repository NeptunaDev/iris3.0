import connectDB from "@/configuration/db";
import {
  deleteOrganization,
  updateOrganization,
} from "@/controllers/organization/organization.controller";
import { verifyJwt } from "@/middlewares/jwt/verifyJwt.middleware";
import { clientIsOwnerOfProject } from "@/middlewares/organization/organization.middleware";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { UpdateOrganizationSchema } from "@/schemas/organization/organization.schema";
import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

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

    const isOwner = await clientIsOwnerOfProject(jwt as JwtPayload, params.id);
    if (isOwner instanceof Error)
      return NextResponse.json(
        { error: isOwner.message, status: 403 },
        { status: 403 }
      );

    const body = await req.json();
    const resValidateSchema = validateSchema(body, UpdateOrganizationSchema);
    if (resValidateSchema) return resValidateSchema;

    const res = await updateOrganization(body, params.id);
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

export async function DELETE(req: Request, { params }: Params) {
  try {
    const jwt = verifyJwt(req);
    if (jwt instanceof Error)
      return NextResponse.json(
        { error: jwt.message, status: 401 },
        { status: 401 }
      );

    const isOwner = await clientIsOwnerOfProject(jwt as JwtPayload, params.id);
    if (isOwner instanceof Error)
      return NextResponse.json(
        { error: isOwner.message, status: 403 },
        { status: 403 }
      );
    const res = await deleteOrganization(params.id);
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
