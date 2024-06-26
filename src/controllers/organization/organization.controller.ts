import { create } from "./create.controller";
import { destroy } from "./destroy.controller";
import { read } from "./read.controller";
import { update } from "./update.controller";

export {
  create as createOrganization,
  read as readOrganizations,
  update as updateOrganization,
  destroy as deleteOrganization,
};
