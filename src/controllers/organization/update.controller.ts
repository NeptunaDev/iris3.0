import OrganizationModel from "@/models/Organization.model";
import { NextResponse } from "next/server";

export const update = async (body: any, id: string) => {
  try {
    const projectUpdated = await OrganizationModel.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Organization updated successfully",
        status: 200,
        data: projectUpdated,
      },
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
