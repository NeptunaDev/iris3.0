export interface FormData {
    [key: string]: {
      label: string;
      value: string;
      type: string;
    };
  }
  export interface Params {
    params: {
      id: string;
    };
  }

  export interface OTPState {
    [index: number]: string;
  }