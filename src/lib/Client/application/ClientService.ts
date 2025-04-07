import { Repository } from "@/lib/Shared/domain/repository";
import { Client, ClientCreate, ClientUpdate } from "../domain/Client";

export const createClientService = (repository: Repository<Client>) => ({
    find: async (criteria?: Partial<Client>) => await repository.find(criteria),
    create: async (clientCreate: ClientCreate) => await repository.create(clientCreate),
    update: async (id: string, clientUpdate: ClientUpdate) => await repository.update(id, clientUpdate),
    remove: async (id: string) => await repository.remove(id),
})