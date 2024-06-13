import SiteModel from "@/models/Site.models";
import { NextResponse } from "next/server";

export const uniqueSiteId = async (siteId: string) => {
  try {
    const site = await SiteModel.findOne({ siteId });
    if (site)
      return NextResponse.json(
        { error: "Site id already exists", status: 400 },
        { status: 400 }
      );
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          status: 500,
        },
        { status: 500 }
      );
    }
  }
};
