export type FormFieldType = 
    | "text" 
    | "number" 
    | "password" 
    | "email" 
    | "tel" 
    | "url" 
    | "search"
    | "date" 
    | "time" 
    | "datetime-local" 
    | "month" 
    | "week" 
    | "color"
    | "range" 
    | "file" 
    | "checkbox" 
    | "radio" 
    | "submit" 
    | "reset"
    | "button" 
    | "image" 
    | "hidden" 
    | "textarea" 
    | "select";

export interface ViewIndividualInfo {
    label: string;
    value: string;
    type: FormFieldType;
}

export interface ViewInfo {
    info: ViewIndividualInfo[];
}

export interface View {
    readonly id: string;
    readonly idAp: string;
    readonly mac: string;
    readonly isLogin: boolean;
    readonly info: ViewInfo | null;
    readonly code: string | null;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface ViewCreate extends Omit<View, 'createdAt' | 'updatedAt' | 'id'> {}

export interface ViewUpdate extends Partial<Omit<View, 'id'>> {
    id: string;
} 