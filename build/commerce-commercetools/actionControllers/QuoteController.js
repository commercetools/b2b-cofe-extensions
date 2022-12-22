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
import { QuoteApi } from '../apis/QuoteApi';
import { getLocale } from '../utils/Request';
const mergeQuotesOverview = (quoteRequests, stagedQuotes, quotes) => {
    return quoteRequests === null || quoteRequests === void 0 ? void 0 : quoteRequests.map((quoteRequest) => {
        const stagedQuote = stagedQuotes === null || stagedQuotes === void 0 ? void 0 : stagedQuotes.find((stagedQuote) => stagedQuote.quoteRequest.id === quoteRequest.id);
        if (stagedQuote) {
            quoteRequest.staged = stagedQuote;
            quoteRequest.quoteRequestState = stagedQuote.stagedQuoteState;
        }
        const quote = quotes === null || quotes === void 0 ? void 0 : quotes.find((quote) => quote.quoteRequest.id === quoteRequest.id);
        if (quote) {
            quoteRequest.quoted = quote;
            quoteRequest.quoteRequestState = quote.quoteState;
        }
        return quoteRequest;
    });
};
export const createQuoteRequest = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const quoteBody = JSON.parse(request.body);
    const cartId = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.cartId;
    if (!cartId) {
        throw new Error('No active cart');
    }
    const cart = yield cartApi.getById(cartId);
    const cartVersion = parseInt(cart.cartVersion, 10);
    const quoteRequest = yield quoteApi.createQuoteRequest({
        cart: {
            typeId: 'cart',
            id: cartId,
        },
        cartVersion,
        comment: quoteBody.comment,
    });
    yield cartApi.deleteCart(cartId, cartVersion);
    const response = {
        statusCode: 200,
        body: JSON.stringify(quoteRequest),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: undefined }),
    };
    return response;
});
export const getMyQuoteRequests = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const accountId = (_c = (_b = request.sessionData) === null || _b === void 0 ? void 0 : _b.account) === null || _c === void 0 ? void 0 : _c.accountId;
    if (!accountId) {
        throw new Error('No active user');
    }
    const quoteRequests = yield quoteApi.getQuoteRequestsByCustomer(accountId);
    const response = {
        statusCode: 200,
        body: JSON.stringify(quoteRequests),
        sessionData: request.sessionData,
    };
    return response;
});
export const getMyQuotesOverview = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const accountId = (_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.account) === null || _e === void 0 ? void 0 : _e.accountId;
    if (!accountId) {
        throw new Error('No active user');
    }
    const quoteRequests = yield quoteApi.getQuoteRequestsByCustomer(accountId);
    const stagedQuotes = yield quoteApi.getStagedQuotesByCustomer(accountId);
    const quotes = yield quoteApi.getQuotesByCustomer(accountId);
    const res = mergeQuotesOverview(quoteRequests, stagedQuotes, quotes);
    const response = {
        statusCode: 200,
        body: JSON.stringify(res),
        sessionData: request.sessionData,
    };
    return response;
});
export const getBusinessUnitQuotesOverview = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const keys = request.query['keys'];
    if (!keys) {
        throw new Error('No business unit');
    }
    const quoteRequests = yield quoteApi.getQuoteRequestsByBusinessUnit(keys);
    const stagedQuotes = yield quoteApi.getStagedQuotesByBusinessUnit(keys);
    const quotes = yield quoteApi.getQuotesByBusinessUnit(keys);
    const res = mergeQuotesOverview(quoteRequests, stagedQuotes, quotes);
    const response = {
        statusCode: 200,
        body: JSON.stringify(res),
        sessionData: request.sessionData,
    };
    return response;
});
export const updateQuoteState = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const ID = (_f = request.query) === null || _f === void 0 ? void 0 : _f['id'];
    const { state } = JSON.parse(request.body);
    const quote = yield quoteApi.updateQuoteState(ID, state);
    const sessionData = Object.assign({}, request.sessionData);
    if (state === 'Accepted') {
        const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
        const stagedQuote = yield quoteApi.getStagedQuote(quote.stagedQuote.id);
        let cart = yield cartApi.getById(stagedQuote.quotationCart.id);
        cart = yield cartApi.setEmail(cart, stagedQuote.customer.obj.email);
        cart = yield cartApi.setLocale(cart, 'en-US');
        const commercetoolsCart = yield cartApi.setCustomerId(cart, stagedQuote.customer.obj.id);
        sessionData.cartId = commercetoolsCart.cartId;
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(quote),
        sessionData,
    };
    return response;
});
//# sourceMappingURL=QuoteController.js.map