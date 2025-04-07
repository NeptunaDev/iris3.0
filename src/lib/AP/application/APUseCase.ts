import { Repository } from "@/lib/Shared/domain/repository";
import { AP, APCreate, APUpdate } from "../domain/AP";

export const createAPService = (repository: Repository<AP>) => ({
    find: async (criteria?: Partial<AP>) => await repository.find(criteria),
    create: async (apCreate: APCreate) => await repository.create(apCreate),
    update: async (id: string, apUpdate: APUpdate) => await repository.update(id, apUpdate),
    remove: async (id: string) => await repository.remove(id),
}) 