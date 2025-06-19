import { Repository } from "@/lib/Shared/domain/repository";
import { Organization, OrganizationCreate, OrganizationUpdate } from "../domain/Organization";

export const createOrganizationService = (repository: Repository<Organization>) => ({
  find: async (criteria?: Partial<Organization>) => await repository.find(criteria),
  create: async (organizationCreate: OrganizationCreate) => await repository.create(organizationCreate),
  update: async (id: string, organizationUpdate: OrganizationUpdate) => await repository.update(id, organizationUpdate),
  remove: async (id: string) => await repository.remove(id),
});