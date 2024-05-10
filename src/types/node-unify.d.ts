declare module 'node-unifi' {
    interface ControllerOptions {
      host: string;
      port: string;
      username: string;
      password: string;
      sslverify: boolean;
      site?: FormDataEntryValue | null;
    }
  
    interface LoginData {
      [key: string]: any;
    }
  
    interface AuthorizeGuestOptions {
      [key: string]: any;
    }
  
    type Request = FormDataEntryValue | null
  
    interface UnifiController {
      login(username: string, password: string): Promise<LoginData>;
      authorizeGuest(id: Request, duration: number, ipAddress?: Request, macAddress?: Request, minutes?: Request, ap?: Request): Promise<any>;
    }
  
    export class Controller {
      constructor(options: ControllerOptions);
      login(username: string, password: string): Promise<LoginData>;
      opts: {
        site: string;
      };
      authorizeGuest(
        id: Request,
        duration: number,
        ipAddress?: Request,
        macAddress?: Request,
        minutes?: Request,
        ap?: Request
      ): Promise<any>;
    }
  }