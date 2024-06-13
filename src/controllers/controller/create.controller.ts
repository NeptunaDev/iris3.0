// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ControllerModel from "@/models/Controller.model";

const create = async (body: any) => {
  try {
    // Save new controller
    const newController = new ControllerModel(body);
    const controller = await newController.save();

    // Return response
    return NextResponse.json(
      {
        message: "Controller created successfully",
        status: 200,
        data: controller,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { create };
