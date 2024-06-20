import SiteModel from "@/models/Site.models";
import { encryptText } from "@/utils/crypto/crypto";

import { NextResponse } from "next/server";

export const update = async (body: any, id: string) => {
  try {
    const newBody = {
      ...body,
      ...(body.password && { password: encryptText(body.password) }),
    };
    const siteUpdated = await SiteModel.findByIdAndUpdate(id, newBody, {
      new: true,
    });
    return NextResponse.json(
      {
        message: "Site updated successfully",
        status: 200,
        data: siteUpdated,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          status: 500,
        },
        {
          status: 500,
        }
      );
    }
  }
};
