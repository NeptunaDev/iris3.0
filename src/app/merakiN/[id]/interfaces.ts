export interface FormData {
    [key: string]: {
      label: string;
      value: string;
      type: string;
      error: string;
      errorMessage: string;
    };
  }
  
  export interface FormField {
    label: string;
    value: string;
    type: string;
    error: string;
    errorMessage: string;
  }
  
  export interface Params {
    params: {
      id: string;
    };
  }
  
  export interface Site {
    _id: string;
    idOrganization: string;
    type: string;
    siteId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AP {
    _id: string;
    idSite: string;
    mac: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface View {
    _id: string;
    idAp: string;
    mac: string;
    isLogin: boolean;
    info: ViewInfo[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ViewInfo {
    label: string;
    value: string;
    type: string;
  } 