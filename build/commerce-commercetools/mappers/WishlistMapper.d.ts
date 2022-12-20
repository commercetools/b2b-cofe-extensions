import { Wishlist, WishlistDraft } from '@Types/wishlist/Wishlist';
import { ShoppingList } from '@commercetools/platform-sdk';
import { ShoppingListDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { Locale } from '../Locale';
export declare class WishlistMapper {
    static commercetoolsShoppingListToWishlist: (commercetoolsShoppingList: ShoppingList, locale: Locale) => Wishlist;
    private static commercetoolsStoreRefToStore;
    private static commercetoolsLineItemToLineItem;
    static wishlistToCommercetoolsShoppingListDraft: (accountId: string, storeKey: string, wishlist: WishlistDraft, locale: Locale) => ShoppingListDraft;
}
