// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ControllerModel from "@/models/Controller.model";

const update = async (body: any) => {
  try {
    // Get data
    const { id } = body;
    delete body.id;

    // Update controller
    const controllerUpdated = await ControllerModel.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    // Return response
    return NextResponse.json(
      {
        message: "Controller updated successfully",
        status: 200,
        data: controllerUpdated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { update };
