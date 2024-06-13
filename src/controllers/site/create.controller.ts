import SiteModel from "@/models/Site.models";
import { NextResponse } from "next/server";

export const create = async (body: any) => {
  try {
    const newSite = new SiteModel(body);
    const site = await newSite.save();

    return NextResponse.json(
      {
        message: "Site created successfully",
        status: 200,
        data: site,
      },
      { status: 200 }
    );
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
