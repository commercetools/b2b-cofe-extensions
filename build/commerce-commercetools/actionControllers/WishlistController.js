var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WishlistApi } from '../apis/WishlistApi';
import { getLocale } from '../utils/Request';
function getWishlistApi(request, actionContext) {
    return new WishlistApi(actionContext.frontasticContext, getLocale(request));
}
function fetchStoreFromSession(request) {
    var _a, _b, _c;
    const store = (_c = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.organization) === null || _b === void 0 ? void 0 : _b.store) === null || _c === void 0 ? void 0 : _c.key;
    if (!store) {
        throw 'No organization in session';
    }
    return store;
}
function fetchAccountFromSession(request) {
    var _a;
    return (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account;
}
function fetchAccountFromSessionEnsureLoggedIn(request) {
    const account = fetchAccountFromSession(request);
    if (!account) {
        throw new Error('Not logged in.');
    }
    return account;
}
function fetchWishlist(request, wishlistApi) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = fetchAccountFromSessionEnsureLoggedIn(request);
        const wishlistId = request.query.id;
        if (wishlistId !== undefined) {
            return yield wishlistApi.getByIdForAccount(wishlistId, account.accountId);
        }
        return null;
    });
}
export const getStoreWishlists = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = fetchAccountFromSessionEnsureLoggedIn(request);
        const wishlistApi = getWishlistApi(request, actionContext);
        const storeKey = fetchStoreFromSession(request);
        const wishlists = yield wishlistApi.getForAccountStore(account.accountId, storeKey);
        return {
            statusCode: 200,
            body: JSON.stringify(wishlists),
            sessionData: request.sessionData,
        };
    }
    catch (e) {
        const response = {
            statusCode: 400,
            error: e,
            errorCode: 400,
        };
        return response;
    }
});
export const getAllWishlists = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const account = fetchAccountFromSessionEnsureLoggedIn(request);
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlists = yield wishlistApi.getForAccount(account.accountId);
    return {
        statusCode: 200,
        body: JSON.stringify(wishlists),
        sessionData: request.sessionData,
    };
});
export const getWishlist = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const wishlistApi = getWishlistApi(request, actionContext);
    try {
        const wishlist = yield fetchWishlist(request, wishlistApi);
        return {
            statusCode: 200,
            body: JSON.stringify(wishlist),
            sessionData: request.sessionData,
        };
    }
    catch (e) {
        return {
            statusCode: 400,
            sessionData: request.sessionData,
            error: (_a = e === null || e === void 0 ? void 0 : e.body) === null || _a === void 0 ? void 0 : _a.message,
            errorCode: 500,
        };
    }
});
export const createWishlist = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistApi = getWishlistApi(request, actionContext);
    const { wishlist } = JSON.parse(request.body);
    const account = fetchAccountFromSessionEnsureLoggedIn(request);
    const store = fetchStoreFromSession(request);
    const wishlistRes = yield wishlistApi.create(account.accountId, store, wishlist);
    return {
        statusCode: 200,
        body: JSON.stringify(wishlistRes),
        sessionData: request.sessionData,
    };
});
export const addToWishlist = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = yield fetchWishlist(request, wishlistApi);
    const body = JSON.parse(request.body);
    const updatedWishlist = yield wishlistApi.addToWishlist(wishlist, {
        sku: ((_b = body === null || body === void 0 ? void 0 : body.variant) === null || _b === void 0 ? void 0 : _b.sku) || undefined,
        count: body.count || 1,
    });
    return {
        statusCode: 200,
        body: JSON.stringify(updatedWishlist),
        sessionData: request.sessionData,
    };
});
export const removeLineItem = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = yield fetchWishlist(request, wishlistApi);
    const body = JSON.parse(request.body);
    const updatedWishlist = yield wishlistApi.removeLineItem(wishlist, (_d = (_c = body.lineItem) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : undefined);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedWishlist),
        sessionData: request.sessionData,
    };
});
export const updateLineItemCount = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = yield fetchWishlist(request, wishlistApi);
    const body = JSON.parse(request.body);
    const updatedWishlist = yield wishlistApi.updateLineItemCount(wishlist, (_f = (_e = body.lineItem) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : undefined, body.count || 1);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedWishlist),
        sessionData: request.sessionData,
    };
});
//# sourceMappingURL=WishlistController.js.map