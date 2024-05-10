// Import dependences
// External
import Joi from "joi";

// Defined interface
export interface Delete {
  id: string;
}

// Delete schema
const DeleteSchema = Joi.object<Delete>({
  id: Joi.string()
    .required()
    .description("The id associated with the controller"),
});

// Export module
export { DeleteSchema };
