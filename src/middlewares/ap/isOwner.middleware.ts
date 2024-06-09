import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

import APModel from "@/models/AP.model";
import { validateClientIsOwner } from "../site/site.middleware";

export const isOwner = async (id: string, jwt: JwtPayload) => {
  try {
    const ap = await APModel.findById(id);
    if (!ap)
      return NextResponse.json(
        { error: "AP not found", status: 404 },
        { status: 404 }
      );
    const { idSite } = ap;
    const resValidateIsOwnerSite = await validateClientIsOwner(
      idSite.toString(),
      jwt
    );
    return resValidateIsOwnerSite;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
    }
  }
};
