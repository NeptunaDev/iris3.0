import { NextResponse } from "next/server";

import SiteModel from "@/models/Site.models";
import { encryptText } from "@/utils/crypto/crypto";

const genereateRandomSiteId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const create = async (body: any) => {
  try {
    const { type, password, ...rest } = body;
    let data = { ...rest, type };
    if (type === "ubiquiti")
      data = { ...data, password: encryptText(password) };
    else data = { ...data, siteId: genereateRandomSiteId() };
    const newSite = new SiteModel(data);
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
