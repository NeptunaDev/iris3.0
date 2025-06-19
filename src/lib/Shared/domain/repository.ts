import { APIResponse, ApiError } from './response';

export interface Repository<T> {
    find(criteria?: Partial<T>): Promise<APIResponse<T[] | number>>;
    create(plant: Partial<Omit<T, "createdAt" | "updatedAt" | "id">>): Promise<APIResponse<T>>;
    update(id: string, plant: Partial<Omit<T, "createdAt" | "updatedAt" | "id">>): Promise<APIResponse<T>>;
    remove(id: string): Promise<APIResponse<void>>;
}