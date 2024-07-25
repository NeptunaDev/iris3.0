import ViewModel from "@/models/View.model";
import { NextResponse } from "next/server";

export const verifyCodeView = async (body: any) => {
  try {
    const { code, id_view } = body;
    const view = await ViewModel.findById(id_view);

    if (!view)
      return NextResponse.json(
        { error: "View not found", status: 404 },
        { status: 404 }
      );

    if (view?.code !== code)
      return NextResponse.json(
        { error: "Code not verified", status: 400 },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message: code === view?.code ? "Code verified" : "Code not verified",
        status: 200,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};
