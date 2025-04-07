import { Repository } from "@/lib/Shared/domain/repository";
import { Site, SiteCreate, SiteCriteria, SiteUpdate } from "../domain/Site";

export const createSiteService = (repository: Repository<Site>) => ({
    find: async (criteria?: SiteCriteria) => await repository.find(criteria),
    create: async (siteCreate: SiteCreate) => await repository.create(siteCreate),
    update: async (id: string, siteUpdate: SiteUpdate) => await repository.update(id, siteUpdate),
    remove: async (id: string) => await repository.remove(id),
}) 