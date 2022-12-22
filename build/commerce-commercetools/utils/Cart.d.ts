import { Cart } from '../../../node_modules/@b2bdemo/types/build/cart/Cart';
export declare const hasUser: (cart: Cart) => boolean;
export declare const hasShippingAddress: (cart: Cart) => boolean;
export declare const hasBillingAddress: (cart: Cart) => boolean;
export declare const hasAddresses: (cart: Cart) => boolean;
export declare const isReadyForCheckout: (cart: Cart) => boolean;
