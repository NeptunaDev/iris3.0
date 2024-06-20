import OrganizationModel from "@/models/Organization.model";
import { NextResponse } from "next/server";

export const destroy = async (id: string) => {
  try {
    const organizationDeleted = await OrganizationModel.findByIdAndDelete(id, {
      new: true,
    });
    return NextResponse.json(
      {
        message: "Organization deleted successfully",
        status: 200,
        data: organizationDeleted,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
      });
    }
  }
};
