import APModel from "@/models/AP.model";
import { NextResponse } from "next/server";

export const create = async (body: any) => {
  try {
    const newAp = new APModel(body);
    const ap = await newAp.save();

    return NextResponse.json(
      {
        message: "AP created successfully",
        status: 200,
        data: ap,
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
