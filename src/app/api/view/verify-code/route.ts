import connectDB from "@/configuration/db";
import { verifyCodeView } from "@/controllers/view/verifyCode.controller";
import validateSchema from "@/middlewares/schema/validate.middleware";
import { VerifyCodeSchema } from "@/schemas/view/verifyCode.schema";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resValidateSchema = validateSchema(body, VerifyCodeSchema);
    if (resValidateSchema) return resValidateSchema;

    const res = await verifyCodeView(body);

    if (res instanceof Error)
      return NextResponse.json(
        { error: res.message, status: 500 },
        { status: 500 }
      );

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
