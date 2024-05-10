// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ViewModel from "@/models/View.model";

const get = async (queries: any) => {
  try {
    // Get data
    const views = await ViewModel.find(queries);

    // Return response
    return NextResponse.json(
      {
        message: "Controller get successfully",
        status: 200,
        data: views,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { get };
