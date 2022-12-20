import { Account, CustomerReference } from '../account/Account';

export enum AssociateRole {
  Admin = 'Admin',
  Buyer = 'Buyer',
}

interface AssociateCustomerReference extends Partial<Account> {
  id: string;
  typeId?: string;
}

export interface Associate {
  roles: AssociateRole[] | string[];
  customer: AssociateCustomerReference;
}
