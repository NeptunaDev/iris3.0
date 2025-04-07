export interface AP {
    readonly id: string;
    readonly idSite: string;
    readonly mac: string;
    readonly name: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface APCreate extends Omit<AP, 'createdAt' | 'updatedAt' | 'id'> {}

export interface APUpdate extends Partial<APCreate> {} 