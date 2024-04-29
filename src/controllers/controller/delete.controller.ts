// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ControllerModel from "@/models/Controller.model";

const destroy = async (body: any) => {
  try {
    // Get data
    const { id } = body;

    // Destroy controller
    await ControllerModel.findByIdAndDelete(id);

    // Return response
    return NextResponse.json(
      {
        message: "Controller deleted successfully",
        status: 200,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { destroy };
