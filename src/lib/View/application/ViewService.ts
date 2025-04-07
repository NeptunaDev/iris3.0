import { Repository } from "@/lib/Shared/domain/repository";
import { View, ViewCreate, ViewUpdate } from "../domain/View";
import { ViewRepository, ViewSendEmail, ViewVerifyCode } from "../domain/ViewRepository";

export const createViewService = (repository: ViewRepository) => ({
    find: async (criteria?: Partial<View>) => await repository.find(criteria),
    create: async (viewCreate: ViewCreate) => await repository.create(viewCreate),
    update: async (id: string, viewUpdate: ViewUpdate) => await repository.update(id, viewUpdate),
    remove: async (id: string) => await repository.remove(id),
    sendEmail: async (viewSendEmail: ViewSendEmail) => await repository.sendEmail(viewSendEmail),
    verifyCode: async (viewVerifyCode: ViewVerifyCode) => await repository.verifyCode(viewVerifyCode),
}) 