export interface InfoItem {
    label?: string;
    type?: string;
    value?: any;
  }
  
  export interface InfoType {
    createdAt: string;
    idAp: string;
    info: InfoItem[];
    isLogin: boolean;
    mac: string;
    updatedAt: string;
    __v: number;
    _id: string;
    siteName: string
    siteId: string;
    label?: string;
    value?: string;
  }

  export interface ProcessedInfoType {
    _id: string;
    [key: string]: any;
  }