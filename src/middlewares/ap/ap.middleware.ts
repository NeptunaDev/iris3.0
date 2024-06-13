import { isOwner } from "./isOwner.middleware";
import { validateUniqueMac } from "./validateUniqueMac.middleware";

export {
  validateUniqueMac as validateMacIsUnique,
  isOwner as validateClientIsOwnerOfAp,
};
