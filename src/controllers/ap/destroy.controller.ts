import { NextResponse } from "next/server";

import APModel from "@/models/AP.model";

export const destroy = async (id: string) => {
  try {
    const ap = await APModel.findByIdAndDelete(id, { new: true });
    return NextResponse.json(
      { message: "AP deleted successfully", status: 200, data: ap },
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
