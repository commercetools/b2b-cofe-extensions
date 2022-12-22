import { Cart } from '@Types/cart/Cart';
export declare const hasUser: (cart: Cart) => boolean;
export declare const hasShippingAddress: (cart: Cart) => boolean;
export declare const hasBillingAddress: (cart: Cart) => boolean;
export declare const hasAddresses: (cart: Cart) => boolean;
export declare const isReadyForCheckout: (cart: Cart) => boolean;
