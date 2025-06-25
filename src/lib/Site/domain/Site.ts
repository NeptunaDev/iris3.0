export interface Site {
    readonly id: string;
    readonly idOrganization: string;
    readonly type: string;
    readonly siteId: string;
    readonly name: string | null;
    readonly host: string | null;
    readonly port: string | null;
    readonly username: string | null;
    readonly password: string | null;
    readonly sslverify: boolean | null;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface SiteCreate extends Omit<Site, 'createdAt' | 'updatedAt' | 'id'> {}

export interface SiteUpdate extends Partial<SiteCreate> {
    id: string;
}

export interface SiteCriteria extends Partial<Site> {}