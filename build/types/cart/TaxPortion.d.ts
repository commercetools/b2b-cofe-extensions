import { Money } from '../product/Money';
export interface TaxPortion {
    amount?: Money;
    name?: string;
    rate?: number;
}
