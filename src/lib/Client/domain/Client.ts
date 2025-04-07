export interface Client {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface ClientCreate extends Omit<Client, 'createdAt' | 'updatedAt' | 'id'> {}

export interface ClientUpdate extends Partial<ClientCreate> {}  