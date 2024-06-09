import APModel from "@/models/AP.model";
import { NextResponse } from "next/server";

export const update = async (id: string, body: any) => {
  try {
    const apUpdated = await APModel.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(
      {
        message: "AP updated successfully",
        status: 200,
        data: apUpdated,
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
