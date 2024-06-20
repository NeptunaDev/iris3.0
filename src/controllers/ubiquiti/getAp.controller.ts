import { QueriesGetUbiquiti } from "@/middlewares/ubiquiti/getQueries.middlewares";
import APModel from "@/models/AP.model";
import { NextResponse } from "next/server";

export const getAp = async (queries: QueriesGetUbiquiti) => {
  try {
    const siteId = queries.siteId;
    const mac = queries.mac;
    const aps = await APModel.find({
      idSite: siteId,
      mac,
    });

    if (aps.length === 0) {
      return NextResponse.json(
        { message: "Ap not found", status: 404 },
        { status: 404 }
      );
    }
    const ap = aps[0];
    return NextResponse.json(
      {
        message: "Ap found",
        data: ap,
        status: 200,
      },
      {
        status: 200,
      }
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
