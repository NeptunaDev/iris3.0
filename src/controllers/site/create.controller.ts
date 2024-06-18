import { NextResponse } from "next/server";

import SiteModel from "@/models/Site.models";
import { encryptText } from "@/utils/crypto/crypto";

export const create = async (body: any) => {
  try {
    console.log(body)
    const newSite = new SiteModel({
      ...body,
      password: encryptText(body.password) 
    });
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
