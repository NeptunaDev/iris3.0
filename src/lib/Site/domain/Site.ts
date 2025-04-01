export interface Site {
    readonly id: string;
    readonly id_organization: string;
    readonly type: string;
    readonly site_id: string;
    readonly name: string | null;
    readonly host: string | null;
    readonly port: string | null;
    readonly username: string | null;
    readonly password: string | null;
    readonly sslverify: string | null;
    readonly created_at: string;
    readonly updated_at: string;
}

export interface SiteCreate extends Omit<Site, 'created_at' | 'updated_at' | 'id'> {}

export interface SiteUpdate extends Partial<SiteCreate> {}