import OrganizationModel from "@/models/Organization.model";
import SiteModel from "@/models/Site.models";
import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const isOwner = async (id: string, jwt: JwtPayload) => {
  try {
    const site = await SiteModel.findById(id);
    if (!site)
      return NextResponse.json(
        { error: "Site not found", status: 404 },
        { status: 404 }
      );
    const { idOrganization } = site;
    const organization = await OrganizationModel.findById(idOrganization);
    if (!organization)
      return NextResponse.json(
        { error: "Organization not found", status: 404 },
        { status: 404 }
      );
    const { idClient } = organization;
    const { id: idClietnJwt } = jwt;
    if (idClient.toString() !== idClietnJwt)
      return NextResponse.json(
        { error: "You are not the owner of this site", status: 403 },
        { status: 403 }
      );

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
