
export interface FormData {
    [key: string]: {
      label: string;
      value: string;
      type: string;
      error: string;
      errorMessage: string;
    };
  }
  
  export interface Params {
    params: {
      id: string;
    };
  }
  
  export interface Site {
    _id: string;
    idOrganization: string;
    type: "ubiquiti" | "meraki";
    siteId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AP {
    _id: string;
    idSite: string;
    mac: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface View {
    idAp: string;
    mac: string;
    isLogin: boolean;
    info: [];
    _id: string;
    createdAt: string;
    updatedAt: string;
  }