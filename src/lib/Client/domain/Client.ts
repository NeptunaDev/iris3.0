export interface Client {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export interface ClientCreate extends Omit<Client, 'created_at' | 'updated_at' | 'id'> {}

export interface ClientUpdate extends Partial<ClientCreate> {}  