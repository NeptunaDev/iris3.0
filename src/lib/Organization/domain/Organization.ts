export interface Organization {
  readonly id: string;
  readonly idClient: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrganizationCreate extends Omit<Organization, 'createdAt' | 'updatedAt' | 'id'> {}

export interface OrganizationUpdate extends Partial<OrganizationCreate> {
  readonly idClient?: string;
}