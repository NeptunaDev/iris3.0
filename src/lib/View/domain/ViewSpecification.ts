import { View } from "./View";

export interface ViewSendEmail {
    viewId: string;
    template: string;
    email: string;
}

export interface ViewVerifyCode {
    code: string;
    viewId: string;
}

export interface ViewFindCriteria extends Partial<View> {
    createdAtStartDate?: string;
    createdAtEndDate?: string;
    onlyCount?: boolean;
    distinct?: string;
}