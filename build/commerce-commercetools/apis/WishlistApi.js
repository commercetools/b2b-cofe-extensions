"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistApi = void 0;
const BaseApi_1 = require("./BaseApi");
const WishlistMapper_1 = require("../mappers/WishlistMapper");
const expandVariants = ['lineItems[*].variant', 'store'];
class WishlistApi extends BaseApi_1.BaseApi {
    constructor() {
        super(...arguments);
        this.getById = (wishlistId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlistId })
                    .get({
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Get wishlist by ID failed: ${error}`);
            }
        });
        this.getForAccount = (accountId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .shoppingLists()
                    .get({
                    queryArgs: {
                        where: `customer(id="${accountId}")`,
                        expand: expandVariants,
                    },
                })
                    .execute();
                return response.body.results.map((shoppingList) => WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale));
            }
            catch (error) {
                throw new Error(`Get wishlist for account failed: ${error}`);
            }
        });
        this.getForAccountStore = (accountId, storeKey) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .shoppingLists()
                    .get({
                    queryArgs: {
                        where: [`customer(id="${accountId}")`, `store(key="${storeKey}")`],
                        expand: expandVariants,
                    },
                })
                    .execute();
                return response.body.results.map((shoppingList) => WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale));
            }
            catch (error) {
                throw new Error(`Get wishlist for account failed: ${error}`);
            }
        });
        this.getByIdForAccount = (wishlistId, accountId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .shoppingLists()
                    .withId({ ID: wishlistId })
                    .get({
                    queryArgs: {
                        where: `customer(id="${accountId}")`,
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw error;
            }
        });
        this.create = (accountId, storeKey, wishlist) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const body = WishlistMapper_1.WishlistMapper.wishlistToCommercetoolsShoppingListDraft(accountId, storeKey, wishlist, locale);
                const response = yield this.getApiForProject()
                    .shoppingLists()
                    .post({
                    body: body,
                    queryArgs: {
                        expand: expandVariants,
                    },
                })
                    .execute();
                return WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Create wishlist failed: ${error}`);
            }
        });
        this.addToWishlist = (wishlist, request) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
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
                return WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Add to wishlist failed: ${error}`);
            }
        });
        this.removeLineItem = (wishlist, lineItemId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
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
                return WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Add to wishlist failed: ${error}`);
            }
        });
        this.updateLineItemCount = (wishlist, lineItemId, count) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
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
                return WishlistMapper_1.WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
            }
            catch (error) {
                throw new Error(`Update line item count: ${error}`);
            }
        });
    }
}
exports.WishlistApi = WishlistApi;
//# sourceMappingURL=WishlistApi.js.map