// Import dependences
// External
import ViewModel from "@/models/View.model";
import { NextResponse } from "next/server";

// Personal

const update = async (body: any) => {
  try {
    // Get data
    const { id } = body;
    delete body.id;

    // Update view
    const viewUpdated = await ViewModel.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    // Return response
    return NextResponse.json(
      {
        message: "View updated successfully",
        status: 200,
        data: viewUpdated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { update };
