import SiteModel, { SiteType } from "@/models/Site.models";
import { NextResponse } from "next/server";

export const updateType = async (body: any, id: string) => {
  try {
    const { type, siteId } = body;
    const site = await SiteModel.findById(id);
    const currentType = site?.type;
    const currentSiteId = site?.siteId;

    // No problems if the type is the same
    if (currentType === type) return null;

    // If want to change the type to UBIQUITI
    // Should have a siteId
    if(type === SiteType.UBIQUITI){
      if(currentSiteId) return null;
      if(!siteId) throw new Error("siteId is required to change the type to UBIQUITI");
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
    }
  }
};
