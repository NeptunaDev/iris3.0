import { Repository } from "@/lib/Shared/domain/repository";
import { View, ViewCreate, ViewUpdate } from "../domain/View";

export const createViewService = (repository: Repository<View>) => ({
    find: async (criteria?: Partial<View>) => await repository.find(criteria),
    create: async (viewCreate: ViewCreate) => await repository.create(viewCreate),
    update: async (id: string, viewUpdate: ViewUpdate) => await repository.update(id, viewUpdate),
    remove: async (id: string) => await repository.remove(id),
}) 