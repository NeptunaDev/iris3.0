import { Repository } from "@/lib/Shared/domain/repository";
import { View } from "./View";
import { APIResponse } from "@/lib/Shared/domain/response";

export interface ViewSendEmail {
    viewId: string;
    template: string;
    email: string;
}

export interface ViewVerifyCode {
    code: string;
    viewId: string;
}

export interface ViewRepository extends Repository<View> {
    sendEmail(viewSendEmail: ViewSendEmail): Promise<APIResponse<void>>;
    verifyCode(viewVerifyCode: ViewVerifyCode): Promise<APIResponse<void>>;
}