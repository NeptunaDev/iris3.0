import SiteModel from "@/models/Site.models";
import { NextResponse } from "next/server";

export const update = async (body: any, id: string) => {
  try {
    const siteUpdated = await SiteModel.findByIdAndUpdate(id, body, {
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
