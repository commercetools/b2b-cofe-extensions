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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitLineItem = exports.replicateCart = exports.removeDiscount = exports.redeemDiscount = exports.updatePayment = exports.addPaymentByInvoice = exports.setShippingMethod = exports.getAvailableShippingMethods = exports.returnItems = exports.getShippingMethods = exports.getOrders = exports.checkout = exports.updateCart = exports.removeLineItem = exports.updateLineItem = exports.addItemsToCart = exports.addToCart = exports.getCart = void 0;
const CartFetcher_1 = require("../utils/CartFetcher");
const Payment_1 = require("../../../node_modules/@b2bdemo/types/build/cart/Payment");
const CartApi_1 = require("../apis/CartApi");
const Request_1 = require("../utils/Request");
const EmailApi_1 = require("../apis/EmailApi");
function updateCartFromRequest(request, actionContext) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
        let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
        if ((request === null || request === void 0 ? void 0 : request.body) === undefined || (request === null || request === void 0 ? void 0 : request.body) === '') {
            return cart;
        }
        const body = JSON.parse(request.body);
        if (((_a = body === null || body === void 0 ? void 0 : body.account) === null || _a === void 0 ? void 0 : _a.email) !== undefined) {
            cart = yield cartApi.setEmail(cart, body.account.email);
        }
        if ((body === null || body === void 0 ? void 0 : body.shipping) !== undefined || (body === null || body === void 0 ? void 0 : body.billing) !== undefined) {
            const shippingAddress = (body === null || body === void 0 ? void 0 : body.shipping) !== undefined ? body.shipping : body.billing;
            const billingAddress = (body === null || body === void 0 ? void 0 : body.billing) !== undefined ? body.billing : body.shipping;
            cart = yield cartApi.setShippingAddress(cart, shippingAddress);
            cart = yield cartApi.setBillingAddress(cart, billingAddress);
        }
        return cart;
    });
}
const getCart = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
        const cartId = cart.cartId;
        const response = {
            statusCode: 200,
            body: JSON.stringify(cart),
            sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
        };
        return response;
    }
    catch (e) {
        const response = {
            statusCode: 400,
            sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: null }),
            error: e === null || e === void 0 ? void 0 : e.message,
            errorCode: 400,
        };
        return response;
    }
});
exports.getCart = getCart;
const addToCart = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const body = JSON.parse(request.body);
    const lineItem = {
        variant: {
            sku: ((_a = body.variant) === null || _a === void 0 ? void 0 : _a.sku) || undefined,
            price: undefined,
        },
        count: +((_b = body.variant) === null || _b === void 0 ? void 0 : _b.count) || 1,
    };
    const distributionChannel = (_d = (_c = request.sessionData.organization) === null || _c === void 0 ? void 0 : _c.distributionChannel) === null || _d === void 0 ? void 0 : _d.id;
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    cart = yield cartApi.addToCart(cart, lineItem, distributionChannel);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
    };
    return response;
});
exports.addToCart = addToCart;
const addItemsToCart = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const body = JSON.parse(request.body);
    const lineItems = (_e = body.list) === null || _e === void 0 ? void 0 : _e.map((variant) => ({
        variant: {
            sku: variant.sku || undefined,
            price: undefined,
        },
        count: +variant.count || 1,
    }));
    const distributionChannel = (_g = (_f = request.sessionData.organization) === null || _f === void 0 ? void 0 : _f.distributionChannel) === null || _g === void 0 ? void 0 : _g.id;
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    cart = yield cartApi.addItemsToCart(cart, lineItems, distributionChannel);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
    };
    return response;
});
exports.addItemsToCart = addItemsToCart;
const updateLineItem = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const body = JSON.parse(request.body);
    const lineItem = {
        lineItemId: (_h = body.lineItem) === null || _h === void 0 ? void 0 : _h.id,
        count: +((_j = body.lineItem) === null || _j === void 0 ? void 0 : _j.count) || 1,
    };
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    cart = yield cartApi.updateLineItem(cart, lineItem);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
    };
    return response;
});
exports.updateLineItem = updateLineItem;
const removeLineItem = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const body = JSON.parse(request.body);
    const lineItem = {
        lineItemId: (_k = body.lineItem) === null || _k === void 0 ? void 0 : _k.id,
    };
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    cart = yield cartApi.removeLineItem(cart, lineItem);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
    };
    return response;
});
exports.removeLineItem = removeLineItem;
const updateCart = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield updateCartFromRequest(request, actionContext);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
    };
    return response;
});
exports.updateCart = updateCart;
const checkout = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const emailApi = new EmailApi_1.EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    let cart = yield updateCartFromRequest(request, actionContext);
    cart = yield cartApi.order(cart);
    const cartId = undefined;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId }),
    };
    return response;
});
exports.checkout = checkout;
const getOrders = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const account = ((_l = request.sessionData) === null || _l === void 0 ? void 0 : _l.account) !== undefined ? request.sessionData.account : undefined;
    if (account === undefined) {
        throw new Error('Not logged in.');
    }
    const orders = yield cartApi.getOrders(account);
    const response = {
        statusCode: 200,
        body: JSON.stringify(orders),
        sessionData: Object.assign({}, request.sessionData),
    };
    return response;
});
exports.getOrders = getOrders;
const getShippingMethods = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
        const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
        const onlyMatching = request.query.onlyMatching === 'true';
        const shippingMethods = yield cartApi.getShippingMethods(onlyMatching);
        const response = {
            statusCode: 200,
            body: JSON.stringify(shippingMethods),
            sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
        };
        return response;
    }
    catch (e) {
        const response = {
            statusCode: 400,
            sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: null }),
            error: e.message,
            errorCode: 400,
        };
        return response;
    }
});
exports.getShippingMethods = getShippingMethods;
const returnItems = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let response;
    try {
        const { orderNumber, returnLineItems } = JSON.parse(request.body);
        const res = yield cartApi.returnItems(orderNumber, returnLineItems);
        response = {
            statusCode: 200,
            body: JSON.stringify(res),
            sessionData: request.sessionData,
        };
    }
    catch (e) {
        response = {
            statusCode: 400,
            sessionData: request.sessionData,
            error: e === null || e === void 0 ? void 0 : e.message,
            errorCode: 500,
        };
    }
    return response;
});
exports.returnItems = returnItems;
const getAvailableShippingMethods = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const availableShippingMethods = yield cartApi.getAvailableShippingMethods(cart);
    const response = {
        statusCode: 200,
        body: JSON.stringify(availableShippingMethods),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
    };
    return response;
});
exports.getAvailableShippingMethods = getAvailableShippingMethods;
const setShippingMethod = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const shippingMethod = {
        shippingMethodId: request.query.shippingMethodId,
    };
    cart = yield cartApi.setShippingMethod(cart, shippingMethod);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
    };
    return response;
});
exports.setShippingMethod = setShippingMethod;
const addPaymentByInvoice = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p, _q;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const payment = Object.assign(Object.assign({}, body.payment), { paymentProvider: 'frontastic', paymentMethod: 'invoice', paymentStatus: Payment_1.PaymentStatuses.PENDING });
    if (payment.amountPlanned === undefined) {
        payment.amountPlanned = {};
    }
    payment.amountPlanned.centAmount = (_o = (_m = payment.amountPlanned.centAmount) !== null && _m !== void 0 ? _m : cart.sum.centAmount) !== null && _o !== void 0 ? _o : undefined;
    payment.amountPlanned.currencyCode = (_q = (_p = payment.amountPlanned.currencyCode) !== null && _p !== void 0 ? _p : cart.sum.currencyCode) !== null && _q !== void 0 ? _q : undefined;
    cart = yield cartApi.addPayment(cart, payment);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
    };
    return response;
});
exports.addPaymentByInvoice = addPaymentByInvoice;
const updatePayment = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const payment = yield cartApi.updatePayment(cart, body.payment);
    const response = {
        statusCode: 200,
        body: JSON.stringify(payment),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
    };
    return response;
});
exports.updatePayment = updatePayment;
const redeemDiscount = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const result = yield cartApi.redeemDiscountCode(cart, body.code);
    let response;
    if (result.data) {
        response = {
            statusCode: 200,
            body: JSON.stringify(result.data),
            sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: result.data.cartId }),
        };
    }
    if (result.error) {
        response = {
            statusCode: result.statusCode,
            errorCode: 101,
            error: result.error,
        };
    }
    return response;
});
exports.redeemDiscount = redeemDiscount;
const removeDiscount = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const discount = {
        discountId: body === null || body === void 0 ? void 0 : body.discountId,
    };
    cart = yield cartApi.removeDiscountCode(cart, discount);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
    };
    return response;
});
exports.removeDiscount = removeDiscount;
const replicateCart = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _r;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const orderId = (_r = request.query) === null || _r === void 0 ? void 0 : _r['orderId'];
    try {
        if (orderId) {
            const cart = yield cartApi.replicateCart(orderId);
            const order = yield cartApi.order(cart);
            const response = {
                statusCode: 200,
                body: JSON.stringify(order),
                sessionData: Object.assign({}, request.sessionData),
            };
            return response;
        }
        throw new Error('Order not found');
    }
    catch (e) {
        const response = {
            statusCode: 400,
            sessionData: request.sessionData,
            error: e === null || e === void 0 ? void 0 : e.message,
            errorCode: 500,
        };
        return response;
    }
});
exports.replicateCart = replicateCart;
const splitLineItem = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _s;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const cartItemsShippingAddresses = cart.itemShippingAddresses || [];
    const remainingAddresses = body.data
        .map((item) => item.address)
        .filter((addressSplit) => cartItemsShippingAddresses.findIndex((address) => address.key === addressSplit.id) === -1);
    if (remainingAddresses.length) {
        try {
            for (var remainingAddresses_1 = __asyncValues(remainingAddresses), remainingAddresses_1_1; remainingAddresses_1_1 = yield remainingAddresses_1.next(), !remainingAddresses_1_1.done;) {
                const address = remainingAddresses_1_1.value;
                yield cartApi.addItemShippingAddress(cart, address);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (remainingAddresses_1_1 && !remainingAddresses_1_1.done && (_s = remainingAddresses_1.return)) yield _s.call(remainingAddresses_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    const target = body.data.map((item) => ({ addressKey: item.address.id, quantity: item.quantity }));
    const cartData = yield cartApi.updateLineItemShippingDetails(cart.cartId, body.lineItemId, target);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cartData),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId: cart.cartId }),
    };
    return response;
});
exports.splitLineItem = splitLineItem;
//# sourceMappingURL=CartController.js.map