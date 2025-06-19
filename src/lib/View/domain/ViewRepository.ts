import { Repository } from "@/lib/Shared/domain/repository";
import { View } from "./View";
import { APIResponse } from "@/lib/Shared/domain/response";
import { ViewFindCriteria, ViewSendEmail, ViewVerifyCode } from "./ViewSpecification";

export interface ViewRepository extends Repository<View> {
    find(criteria?: ViewFindCriteria): Promise<APIResponse<View[] | number>>;
    sendEmail(viewSendEmail: ViewSendEmail): Promise<APIResponse<void>>;
    verifyCode(viewVerifyCode: ViewVerifyCode): Promise<APIResponse<void>>;
}