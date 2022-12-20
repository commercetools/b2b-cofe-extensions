import { CartApi } from '../apis/CartApi';
import { getLocale } from './Request';
export class CartFetcher {
    static async fetchCart(request, actionContext) {
        var _a, _b;
        const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
        if (((_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) !== undefined) {
            return await cartApi.getForUser(request.sessionData.account, request.sessionData.organization);
        }
        if (((_b = request.sessionData) === null || _b === void 0 ? void 0 : _b.cartId) !== undefined) {
            try {
                return await cartApi.getById(request.sessionData.cartId);
            }
            catch (error) {
                console.info(`Error fetching the cart ${request.sessionData.cartId}, creating a new one. ${error}`);
            }
        }
        return {};
    }
}
//# sourceMappingURL=CartFetcher.js.map