import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

import APModel from "@/models/AP.model";
import OrganizationModel from "@/models/Organization.model";
import SiteModel from "@/models/Site.models";

export const read = async (jwt: JwtPayload) => {
  try {
    const { id: idClient } = jwt;
    const organizations = await OrganizationModel.find({ idClient });
    const organizationsId = organizations.map(
      (organization) => organization._id
    );
    const sites = await SiteModel.find({
      idOrganization: { $in: organizationsId },
    });
    const aps = await APModel.find({
      idSite: { $in: sites.map((site) => site._id) },
    });
    return NextResponse.json(
      { message: "AP read successfully", status: 200, data: aps },
      { status: 200 }
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
