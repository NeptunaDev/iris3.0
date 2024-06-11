// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ViewModel from "@/models/View.model";

const getUniqueDevices = async (queries: any) => {
  try {
    // Get data
    const { idAp } = queries;
    
    const uniqueAps = await ViewModel.distinct("mac", { idAp: idAp });
    
    // Return response
    return NextResponse.json(
      {
        message: "Controller get successfully",
        status: 200,
        data: uniqueAps.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { getUniqueDevices };
