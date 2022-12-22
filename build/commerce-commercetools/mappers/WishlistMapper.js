"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistMapper = void 0;
const ProductRouter_1 = require("../utils/ProductRouter");
class WishlistMapper {
}
exports.WishlistMapper = WishlistMapper;
WishlistMapper.commercetoolsShoppingListToWishlist = (commercetoolsShoppingList, locale) => {
    var _a, _b, _c;
    return {
        wishlistId: commercetoolsShoppingList.id,
        wishlistVersion: commercetoolsShoppingList.version.toString(),
        anonymousId: commercetoolsShoppingList.anonymousId,
        accountId: (_b = (_a = commercetoolsShoppingList.customer) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : undefined,
        name: commercetoolsShoppingList.name[locale.language],
        description: (_c = commercetoolsShoppingList.description) === null || _c === void 0 ? void 0 : _c[locale.language],
        lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) => WishlistMapper.commercetoolsLineItemToLineItem(lineItem, locale)),
        store: WishlistMapper.commercetoolsStoreRefToStore(commercetoolsShoppingList.store),
    };
};
WishlistMapper.commercetoolsStoreRefToStore = (commercetoolsStoreRef) => {
    return Object.assign({ id: commercetoolsStoreRef === null || commercetoolsStoreRef === void 0 ? void 0 : commercetoolsStoreRef.id, key: commercetoolsStoreRef === null || commercetoolsStoreRef === void 0 ? void 0 : commercetoolsStoreRef.key }, commercetoolsStoreRef === null || commercetoolsStoreRef === void 0 ? void 0 : commercetoolsStoreRef.obj);
};
WishlistMapper.commercetoolsLineItemToLineItem = (commercetoolsLineItem, locale) => {
    var _a, _b;
    const lineItem = {
        lineItemId: commercetoolsLineItem.id,
        name: commercetoolsLineItem.name[locale.language],
        type: 'variant',
        addedAt: new Date(commercetoolsLineItem.addedAt),
        count: commercetoolsLineItem.quantity,
        variant: {
            sku: commercetoolsLineItem.variant.sku,
            images: (_b = (_a = commercetoolsLineItem.variant) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? void 0 : _b.map((image) => image.url),
        },
    };
    lineItem._url = ProductRouter_1.ProductRouter.generateUrlFor(lineItem);
    return lineItem;
};
WishlistMapper.wishlistToCommercetoolsShoppingListDraft = (accountId, storeKey, wishlist, locale) => {
    return {
        customer: !accountId ? undefined : { typeId: 'customer', id: accountId },
        name: { [locale.language]: wishlist.name || '' },
        description: { [locale.language]: wishlist.description || '' },
        store: !storeKey ? undefined : { typeId: 'store', key: storeKey },
    };
};
//# sourceMappingURL=WishlistMapper.js.map