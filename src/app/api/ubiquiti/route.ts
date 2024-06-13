import connectDB from "@/configuration/db";
import {
  getApToUbiquitiController,
  getSiteToUbiquitiController,
} from "@/controllers/ubiquiti/ubiquiti.controller";
import { getQueriesForUbiquiti } from "@/middlewares/ubiquiti/ubiquiti.middleware";
import { NextResponse } from "next/server";

connectDB();
export async function GET(req: Request) {
  try {
    const queries = getQueriesForUbiquiti(req);

    const methods = {
      SITE: getSiteToUbiquitiController,
      AP: getApToUbiquitiController,
    };

    if (queries.type) {
      const res = await methods[queries.type](queries);
      return res;
    }

    return NextResponse.json(
      { message: "Not found", status: 404 },
      { status: 404 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { error: error.message, status: 500 },
        { status: 500 }
      );
  }
}
