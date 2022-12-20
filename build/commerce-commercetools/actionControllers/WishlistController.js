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
async function fetchWishlist(request, wishlistApi) {
    const account = fetchAccountFromSessionEnsureLoggedIn(request);
    const wishlistId = request.query.id;
    if (wishlistId !== undefined) {
        return await wishlistApi.getByIdForAccount(wishlistId, account.accountId);
    }
    return null;
}
export const getStoreWishlists = async (request, actionContext) => {
    try {
        const account = fetchAccountFromSessionEnsureLoggedIn(request);
        const wishlistApi = getWishlistApi(request, actionContext);
        const storeKey = fetchStoreFromSession(request);
        const wishlists = await wishlistApi.getForAccountStore(account.accountId, storeKey);
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
};
export const getAllWishlists = async (request, actionContext) => {
    const account = fetchAccountFromSessionEnsureLoggedIn(request);
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlists = await wishlistApi.getForAccount(account.accountId);
    return {
        statusCode: 200,
        body: JSON.stringify(wishlists),
        sessionData: request.sessionData,
    };
};
export const getWishlist = async (request, actionContext) => {
    var _a;
    const wishlistApi = getWishlistApi(request, actionContext);
    try {
        const wishlist = await fetchWishlist(request, wishlistApi);
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
};
export const createWishlist = async (request, actionContext) => {
    const wishlistApi = getWishlistApi(request, actionContext);
    const { wishlist } = JSON.parse(request.body);
    const account = fetchAccountFromSessionEnsureLoggedIn(request);
    const store = fetchStoreFromSession(request);
    const wishlistRes = await wishlistApi.create(account.accountId, store, wishlist);
    return {
        statusCode: 200,
        body: JSON.stringify(wishlistRes),
        sessionData: request.sessionData,
    };
};
export const addToWishlist = async (request, actionContext) => {
    var _a;
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await fetchWishlist(request, wishlistApi);
    const body = JSON.parse(request.body);
    const updatedWishlist = await wishlistApi.addToWishlist(wishlist, {
        sku: ((_a = body === null || body === void 0 ? void 0 : body.variant) === null || _a === void 0 ? void 0 : _a.sku) || undefined,
        count: body.count || 1,
    });
    return {
        statusCode: 200,
        body: JSON.stringify(updatedWishlist),
        sessionData: request.sessionData,
    };
};
export const removeLineItem = async (request, actionContext) => {
    var _a, _b;
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await fetchWishlist(request, wishlistApi);
    const body = JSON.parse(request.body);
    const updatedWishlist = await wishlistApi.removeLineItem(wishlist, (_b = (_a = body.lineItem) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : undefined);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedWishlist),
        sessionData: request.sessionData,
    };
};
export const updateLineItemCount = async (request, actionContext) => {
    var _a, _b;
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await fetchWishlist(request, wishlistApi);
    const body = JSON.parse(request.body);
    const updatedWishlist = await wishlistApi.updateLineItemCount(wishlist, (_b = (_a = body.lineItem) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : undefined, body.count || 1);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedWishlist),
        sessionData: request.sessionData,
    };
};
//# sourceMappingURL=WishlistController.js.map