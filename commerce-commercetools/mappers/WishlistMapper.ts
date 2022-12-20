import { Wishlist, WishlistDraft } from '@Types/wishlist/Wishlist';
import { ShoppingList, ShoppingListLineItem } from '@commercetools/platform-sdk';
import { ShoppingListDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { Locale } from '../Locale';
import { LineItem } from '@Types/wishlist/LineItem';
import { ProductRouter } from '../utils/ProductRouter';
import { Store, StoreKeyReference } from '@Types/store/store';

export class WishlistMapper {
  static commercetoolsShoppingListToWishlist = (commercetoolsShoppingList: ShoppingList, locale: Locale): Wishlist => {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      anonymousId: commercetoolsShoppingList.anonymousId,
      accountId: commercetoolsShoppingList.customer?.id ?? undefined,
      name: commercetoolsShoppingList.name[locale.language],
      description: commercetoolsShoppingList.description?.[locale.language],
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        WishlistMapper.commercetoolsLineItemToLineItem(lineItem, locale),
      ),
      store: WishlistMapper.commercetoolsStoreRefToStore(commercetoolsShoppingList.store),
    };
  };

  private static commercetoolsStoreRefToStore = (commercetoolsStoreRef: StoreKeyReference): Store => {
    return {
      id: commercetoolsStoreRef?.id,
      key: commercetoolsStoreRef?.key,
      // @ts-ignore
      ...commercetoolsStoreRef?.obj,
    };
  };

  private static commercetoolsLineItemToLineItem = (
    commercetoolsLineItem: ShoppingListLineItem,
    locale: Locale,
  ): LineItem => {
    const lineItem: LineItem = {
      lineItemId: commercetoolsLineItem.id,
      name: commercetoolsLineItem.name[locale.language],
      type: 'variant',
      addedAt: new Date(commercetoolsLineItem.addedAt),
      count: commercetoolsLineItem.quantity,
      variant: {
        sku: commercetoolsLineItem.variant.sku,
        images: commercetoolsLineItem.variant?.images?.map((image) => image.url),
      },
    };
    lineItem._url = ProductRouter.generateUrlFor(lineItem);
    return lineItem;
  };

  static wishlistToCommercetoolsShoppingListDraft = (
    accountId: string,
    storeKey: string,
    wishlist: WishlistDraft,
    locale: Locale,
  ): ShoppingListDraft => {
    return {
      customer: !accountId ? undefined : { typeId: 'customer', id: accountId },
      name: { [locale.language]: wishlist.name || '' },
      description: { [locale.language]: wishlist.description || '' },
      store: !storeKey ? undefined : { typeId: 'store', key: storeKey },
    };
  };
}
