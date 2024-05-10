// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ControllerModel from "@/models/Controller.model";

const get = async (queries: any) => {
  try {
    // Get data
    const controllers = await ControllerModel.find(queries);

    // Return response
    return NextResponse.json(
      {
        message: "Controller get successfully",
        status: 200,
        data: controllers
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { get };
