import APModel from "@/models/AP.model";
import { NextResponse } from "next/server";

export const validateUniqueMac = async (mac: string) => {
  try {
    const ap = await APModel.findOne({ mac });
    if (ap)
      return NextResponse.json(
        { error: "Mac already exists", status: 400 },
        { status: 400 }
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
