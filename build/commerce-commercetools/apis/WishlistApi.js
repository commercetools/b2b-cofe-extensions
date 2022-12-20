import { BaseApi } from './BaseApi';
import { WishlistMapper } from '../mappers/WishlistMapper';
const expandVariants = ['lineItems[*].variant', 'store'];
export class WishlistApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.getById = async (wishlistId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlistId })
                    .get({
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Get wishlist by ID failed: ${error}`);
            }
        };
        this.getForAccount = async (accountId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .get({
                    queryArgs: {
                        where: `customer(id="${accountId}")`,
                        expand: expandVariants,
                    },
                })
                    .execute();
                return response.body.results.map((shoppingList) => WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale));
            }
            catch (error) {
                throw new Error(`Get wishlist for account failed: ${error}`);
            }
        };
        this.getForAccountStore = async (accountId, storeKey) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .get({
                    queryArgs: {
                        where: [`customer(id="${accountId}")`, `store(key="${storeKey}")`],
                        expand: expandVariants,
                    },
                })
                    .execute();
                return response.body.results.map((shoppingList) => WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale));
            }
            catch (error) {
                throw new Error(`Get wishlist for account failed: ${error}`);
            }
        };
        this.getByIdForAccount = async (wishlistId, accountId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlistId })
                    .get({
                    queryArgs: {
                        where: `customer(id="${accountId}")`,
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw error;
            }
        };
        this.create = async (accountId, storeKey, wishlist) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const body = WishlistMapper.wishlistToCommercetoolsShoppingListDraft(accountId, storeKey, wishlist, locale);
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .post({
                    body: body,
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Create wishlist failed: ${error}`);
            }
        };
        this.addToWishlist = async (wishlist, request) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlist.wishlistId })
                    .post({
                    body: {
                        version: +wishlist.wishlistVersion,
                        actions: [
                            {
                                action: 'addLineItem',
                                sku: request.sku,
                                quantity: request.count,
                            },
                        ],
                    },
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Add to wishlist failed: ${error}`);
            }
        };
        this.removeLineItem = async (wishlist, lineItemId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlist.wishlistId })
                    .post({
                    body: {
                        version: +wishlist.wishlistVersion,
                        actions: [
                            {
                                action: 'removeLineItem',
                                lineItemId,
                            },
                        ],
                    },
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Add to wishlist failed: ${error}`);
            }
        };
        this.updateLineItemCount = async (wishlist, lineItemId, count) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlist.wishlistId })
                    .post({
                    body: {
                        version: +wishlist.wishlistVersion,
                        actions: [
                            {
                                action: 'changeLineItemQuantity',
                                lineItemId,
                                quantity: count,
                            },
                        ],
                    },
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Update line item count: ${error}`);
            }
        };
    }
}
//# sourceMappingURL=WishlistApi.js.map