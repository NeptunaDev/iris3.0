// Import dependences
// External
import { NextRequest, NextResponse } from "next/server";

// Personal
import { getUniqueDevicesView } from "@/controllers/view/view.controller";
import { getQueries } from "@/utils/api/request/getQueries";

// Get view
export async function GET(req: NextRequest) {
  try {
    // Get Data
    const queries = getQueries(req);
    if (!("idController" in queries)) {
      return NextResponse.json(
        { error: "idController is required", status: 400 },
        { status: 400 }
      );
    }

    const res = await getUniqueDevicesView(queries);
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