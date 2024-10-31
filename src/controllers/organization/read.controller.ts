import OrganizationModel from "@/models/Organization.model";
import {JwtPayload} from "jsonwebtoken";
import {NextResponse} from "next/server";

export const read = async (jwt: JwtPayload) => {
  try {
    const {id: idClient, type} = jwt;

    let projects =  [];
    if (type === 'superadmin') {
      projects = await OrganizationModel.find();
    } else {
      projects = await OrganizationModel.find({idClient});
    }

    return NextResponse.json(
      {
        message: "Organizations fetched successfully",
        status: 200,
        data: projects,
      },
      {status: 200}
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Error(error.message);
    }
  }
};
