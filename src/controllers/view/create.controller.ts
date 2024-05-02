// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ViewModel from "@/models/View.model";

const create = async (body: any) => {
  try {
    // Save new view
    const newView = new ViewModel(body);
    const view = await newView.save();

    // Return response
    return NextResponse.json(
      {
        message: "View created successfully",
        status: 200,
        data: view,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { create };
