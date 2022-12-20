import { Account } from '../account/Account';
export declare enum AssociateRole {
    Admin = "Admin",
    Buyer = "Buyer"
}
interface AssociateCustomerReference extends Partial<Account> {
    id: string;
    typeId?: string;
}
export interface Associate {
    roles: AssociateRole[] | string[];
    customer: AssociateCustomerReference;
}
export {};
