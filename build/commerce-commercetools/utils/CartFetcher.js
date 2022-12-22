var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CartApi } from '../apis/CartApi';
import { getLocale } from './Request';
export class CartFetcher {
    static fetchCart(request, actionContext) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
            if (((_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) !== undefined) {
                return yield cartApi.getForUser(request.sessionData.account, request.sessionData.organization);
            }
            if (((_b = request.sessionData) === null || _b === void 0 ? void 0 : _b.cartId) !== undefined) {
                try {
                    return yield cartApi.getById(request.sessionData.cartId);
                }
                catch (error) {
                    console.info(`Error fetching the cart ${request.sessionData.cartId}, creating a new one. ${error}`);
                }
            }
            return {};
        });
    }
}
//# sourceMappingURL=CartFetcher.js.map