import { Dayjs } from "dayjs";

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

  export interface CustomDatePickerProps {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    onStartDateChange: (date: Dayjs | null) => void;
    onEndDateChange: (date: Dayjs | null) => void;
  }

  export interface PortalViewCardProps {
    dateRange: {
      startDate: Dayjs | null;
      endDate: Dayjs | null;
    };
  }

  export interface PortalViewData {
    // Define your data structure here
  }