import { BaseApi } from './BaseApi';
import { Wishlist, WishlistDraft } from '@Types/wishlist/Wishlist';
interface AddToWishlistRequest {
    sku: string;
    count: number;
}
export declare class WishlistApi extends BaseApi {
    getById: (wishlistId: string) => Promise<Wishlist>;
    getForAccount: (accountId: string) => Promise<Wishlist[]>;
    getForAccountStore: (accountId: string, storeKey: string) => Promise<Wishlist[]>;
    getByIdForAccount: (wishlistId: string, accountId: string) => Promise<Wishlist>;
    create: (accountId: string, storeKey: string, wishlist: WishlistDraft) => Promise<Wishlist>;
    addToWishlist: (wishlist: Wishlist, request: AddToWishlistRequest) => Promise<Wishlist>;
    removeLineItem: (wishlist: Wishlist, lineItemId: string) => Promise<Wishlist>;
    updateLineItemCount: (wishlist: Wishlist, lineItemId: string, count: number) => Promise<Wishlist>;
}
export {};
