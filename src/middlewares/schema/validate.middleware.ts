// Import dependences
import Joi from "joi";
import { NextResponse } from "next/server";

// Function to validate schema
const validateSchema = (body: any, schema: Joi.ObjectSchema<any>) => {
  try {
    // Options for validation
    const options: Joi.ValidationOptions = {
      abortEarly: true,
      allowUnknown: false,
      stripUnknown: false,
    };

    // Validate schema
    const { error, value } = schema.validate(body, options);

    // Return error if exists
    if (error) {
      return NextResponse.json(
        {
          message: "Bad request",
          status: 400,
          error: `Validation error: ${error.details
            .map((e) => e.message)
            .join(", ")}`,
        },
        { status: 400 }
      );
    }

    return null;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error",
        status: 500,
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// Export module
export default validateSchema;
