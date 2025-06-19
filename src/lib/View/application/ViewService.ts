import { View, ViewCreate, ViewUpdate } from "../domain/View";
import { ViewRepository } from "../domain/ViewRepository";
import { ViewFindCriteria, ViewSendEmail, ViewVerifyCode } from "../domain/ViewSpecification";



export const createViewService = (repository: ViewRepository) => ({
    find: async (criteria?: ViewFindCriteria) => await repository.find(criteria),
    create: async (viewCreate: ViewCreate) => await repository.create(viewCreate),
    update: async (id: string, viewUpdate: ViewUpdate) => await repository.update(id, viewUpdate),
    remove: async (id: string) => await repository.remove(id),
    sendEmail: async (viewSendEmail: ViewSendEmail) => await repository.sendEmail(viewSendEmail),
    verifyCode: async (viewVerifyCode: ViewVerifyCode) => await repository.verifyCode(viewVerifyCode),
}) 