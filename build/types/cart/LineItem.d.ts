import { Discount } from './Discount';
import { Variant } from '../product/Variant';
import { Money } from '../product/Money';
export interface LineItemReturnItemDraft {
    quantity: number;
    lineItemId: string;
    comment?: string;
    shipmentState: string;
}
export interface Target {
    quantity: number;
    addressKey: string;
}
export interface LineItem {
    lineItemId?: string;
    name?: string;
    type?: string;
    count?: number;
    price?: Money;
    discountedPrice?: Money;
    discountTexts?: string[];
    discounts?: Discount[];
    totalPrice?: Money;
    variant?: Variant;
    isGift?: boolean;
    _url?: string;
    shippingDetails?: {
        targets?: Target[];
        valid: boolean;
    };
}
