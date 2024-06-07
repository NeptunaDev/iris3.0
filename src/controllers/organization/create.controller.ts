import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import connectDB from "@/configuration/db";
import OrganizationModel from "@/models/Organization.model";

connectDB();
const create = async (body: any, jwt: JwtPayload) => {
  try {
    const { id: idClient } = jwt;
    const newProject = new OrganizationModel({ ...body, idClient });
    const project = await newProject.save();
    return NextResponse.json(
      {
        message: "Organization created successfully",
        status: 200,
        data: project,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Error(error.message);
    }
  }
};

export default create;
