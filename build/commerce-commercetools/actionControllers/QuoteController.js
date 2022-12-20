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
export const createQuoteRequest = async (request, actionContext) => {
    var _a;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const quoteBody = JSON.parse(request.body);
    const cartId = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.cartId;
    if (!cartId) {
        throw new Error('No active cart');
    }
    const cart = await cartApi.getById(cartId);
    const cartVersion = parseInt(cart.cartVersion, 10);
    const quoteRequest = await quoteApi.createQuoteRequest({
        cart: {
            typeId: 'cart',
            id: cartId,
        },
        cartVersion,
        comment: quoteBody.comment,
    });
    await cartApi.deleteCart(cartId, cartVersion);
    const response = {
        statusCode: 200,
        body: JSON.stringify(quoteRequest),
        sessionData: {
            ...request.sessionData,
            cartId: undefined,
        },
    };
    return response;
};
export const getMyQuoteRequests = async (request, actionContext) => {
    var _a, _b;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const accountId = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId;
    if (!accountId) {
        throw new Error('No active user');
    }
    const quoteRequests = await quoteApi.getQuoteRequestsByCustomer(accountId);
    const response = {
        statusCode: 200,
        body: JSON.stringify(quoteRequests),
        sessionData: request.sessionData,
    };
    return response;
};
export const getMyQuotesOverview = async (request, actionContext) => {
    var _a, _b;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const accountId = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId;
    if (!accountId) {
        throw new Error('No active user');
    }
    const quoteRequests = await quoteApi.getQuoteRequestsByCustomer(accountId);
    const stagedQuotes = await quoteApi.getStagedQuotesByCustomer(accountId);
    const quotes = await quoteApi.getQuotesByCustomer(accountId);
    const res = mergeQuotesOverview(quoteRequests, stagedQuotes, quotes);
    const response = {
        statusCode: 200,
        body: JSON.stringify(res),
        sessionData: request.sessionData,
    };
    return response;
};
export const getBusinessUnitQuotesOverview = async (request, actionContext) => {
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const keys = request.query['keys'];
    if (!keys) {
        throw new Error('No business unit');
    }
    const quoteRequests = await quoteApi.getQuoteRequestsByBusinessUnit(keys);
    const stagedQuotes = await quoteApi.getStagedQuotesByBusinessUnit(keys);
    const quotes = await quoteApi.getQuotesByBusinessUnit(keys);
    const res = mergeQuotesOverview(quoteRequests, stagedQuotes, quotes);
    const response = {
        statusCode: 200,
        body: JSON.stringify(res),
        sessionData: request.sessionData,
    };
    return response;
};
export const updateQuoteState = async (request, actionContext) => {
    var _a;
    const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
    const ID = (_a = request.query) === null || _a === void 0 ? void 0 : _a['id'];
    const { state } = JSON.parse(request.body);
    const quote = await quoteApi.updateQuoteState(ID, state);
    const sessionData = { ...request.sessionData };
    if (state === 'Accepted') {
        const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
        const stagedQuote = await quoteApi.getStagedQuote(quote.stagedQuote.id);
        let cart = await cartApi.getById(stagedQuote.quotationCart.id);
        cart = await cartApi.setEmail(cart, stagedQuote.customer.obj.email);
        cart = await cartApi.setLocale(cart, 'en-US');
        const commercetoolsCart = await cartApi.setCustomerId(cart, stagedQuote.customer.obj.id);
        sessionData.cartId = commercetoolsCart.cartId;
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(quote),
        sessionData,
    };
    return response;
};
//# sourceMappingURL=QuoteController.js.map