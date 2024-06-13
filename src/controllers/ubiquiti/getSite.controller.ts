import { QueriesGetUbiquiti } from "@/middlewares/ubiquiti/getQueries.middlewares";
import SiteModel from "@/models/Site.models";
import { NextResponse } from "next/server";

export const getSite = async (queries: QueriesGetUbiquiti) => {
  try {
    const siteId = queries.siteId;
    const sites = await SiteModel.find({ siteId });
    if (sites.length === 0) {
      return NextResponse.json(
        { message: "Site not found", status: 404 },
        { status: 404 }
      );
    }
    const site = sites[0];
    return NextResponse.json(
      {
        message: "Site found",
        data: site,
        status: 200,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
    }
  }
};
