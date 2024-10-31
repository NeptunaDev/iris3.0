import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

import OrganizationModel from "@/models/Organization.model";
import SiteModel from "@/models/Site.models";

export const read = async (jwt: JwtPayload) => {
  try {
    const { id: idClient, type } = jwt;

    let site = [];
    if (type === 'superadmin'){
      site = await SiteModel.find()
    } else {
    const organizations = await OrganizationModel.find({ idClient });
    const organizationsId = organizations.map(
      (organization) => organization._id
    );
    const sites = await SiteModel.find({
      idOrganization: { $in: organizationsId },
    });
  
    return NextResponse.json(
      { message: "Site read successfully", status: 200, data: sites },
      { status: 200 }
    );
  }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
    }
  }
};
