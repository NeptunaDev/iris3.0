import { NextResponse } from "next/server";

import SiteModel from "@/models/Site.models";

export const destroy = async (id: string) => {
  try {
    const siteDeleted = await SiteModel.findByIdAndDelete(id, { new: true });
    return NextResponse.json(
      {
        message: "Site deleted successfully",
        status: 200,
        data: siteDeleted,
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
