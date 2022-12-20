import { Money } from '../product/Money';
export interface Discount {
    discountId?: string;
    code?: string;
    state?: string;
    name?: string;
    description?: string;
    discountedAmount?: Money;
}
