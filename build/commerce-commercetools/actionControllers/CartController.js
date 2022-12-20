import { CartFetcher } from '../utils/CartFetcher';
import { PaymentStatuses } from '@Types/cart/Payment';
import { CartApi } from '../apis/CartApi';
import { getLocale } from '../utils/Request';
import { EmailApi } from '../apis/EmailApi';
async function updateCartFromRequest(request, actionContext) {
    var _a;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    let cart = await CartFetcher.fetchCart(request, actionContext);
    if ((request === null || request === void 0 ? void 0 : request.body) === undefined || (request === null || request === void 0 ? void 0 : request.body) === '') {
        return cart;
    }
    const body = JSON.parse(request.body);
    if (((_a = body === null || body === void 0 ? void 0 : body.account) === null || _a === void 0 ? void 0 : _a.email) !== undefined) {
        cart = await cartApi.setEmail(cart, body.account.email);
    }
    if ((body === null || body === void 0 ? void 0 : body.shipping) !== undefined || (body === null || body === void 0 ? void 0 : body.billing) !== undefined) {
        const shippingAddress = (body === null || body === void 0 ? void 0 : body.shipping) !== undefined ? body.shipping : body.billing;
        const billingAddress = (body === null || body === void 0 ? void 0 : body.billing) !== undefined ? body.billing : body.shipping;
        cart = await cartApi.setShippingAddress(cart, shippingAddress);
        cart = await cartApi.setBillingAddress(cart, billingAddress);
    }
    return cart;
}
export const getCart = async (request, actionContext) => {
    try {
        const cart = await CartFetcher.fetchCart(request, actionContext);
        const cartId = cart.cartId;
        const response = {
            statusCode: 200,
            body: JSON.stringify(cart),
            sessionData: {
                ...request.sessionData,
                cartId,
            },
        };
        return response;
    }
    catch (e) {
        const response = {
            statusCode: 400,
            sessionData: {
                ...request.sessionData,
                cartId: null,
            },
            error: e === null || e === void 0 ? void 0 : e.message,
            errorCode: 400,
        };
        return response;
    }
};
export const addToCart = async (request, actionContext) => {
    var _a, _b, _c, _d;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const body = JSON.parse(request.body);
    const lineItem = {
        variant: {
            sku: ((_a = body.variant) === null || _a === void 0 ? void 0 : _a.sku) || undefined,
            price: undefined,
        },
        count: +((_b = body.variant) === null || _b === void 0 ? void 0 : _b.count) || 1,
    };
    const distributionChannel = (_d = (_c = request.sessionData.organization) === null || _c === void 0 ? void 0 : _c.distributionChannel) === null || _d === void 0 ? void 0 : _d.id;
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.addToCart(cart, lineItem, distributionChannel);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId,
        },
    };
    return response;
};
export const addItemsToCart = async (request, actionContext) => {
    var _a, _b, _c;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const body = JSON.parse(request.body);
    const lineItems = (_a = body.list) === null || _a === void 0 ? void 0 : _a.map((variant) => ({
        variant: {
            sku: variant.sku || undefined,
            price: undefined,
        },
        count: +variant.count || 1,
    }));
    const distributionChannel = (_c = (_b = request.sessionData.organization) === null || _b === void 0 ? void 0 : _b.distributionChannel) === null || _c === void 0 ? void 0 : _c.id;
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.addItemsToCart(cart, lineItems, distributionChannel);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId,
        },
    };
    return response;
};
export const updateLineItem = async (request, actionContext) => {
    var _a, _b;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const body = JSON.parse(request.body);
    const lineItem = {
        lineItemId: (_a = body.lineItem) === null || _a === void 0 ? void 0 : _a.id,
        count: +((_b = body.lineItem) === null || _b === void 0 ? void 0 : _b.count) || 1,
    };
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.updateLineItem(cart, lineItem);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId,
        },
    };
    return response;
};
export const removeLineItem = async (request, actionContext) => {
    var _a;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const body = JSON.parse(request.body);
    const lineItem = {
        lineItemId: (_a = body.lineItem) === null || _a === void 0 ? void 0 : _a.id,
    };
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.removeLineItem(cart, lineItem);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId,
        },
    };
    return response;
};
export const updateCart = async (request, actionContext) => {
    const cart = await updateCartFromRequest(request, actionContext);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId,
        },
    };
    return response;
};
export const checkout = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const emailApi = new EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    let cart = await updateCartFromRequest(request, actionContext);
    cart = await cartApi.order(cart);
    const cartId = undefined;
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId,
        },
    };
    return response;
};
export const getOrders = async (request, actionContext) => {
    var _a;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const account = ((_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) !== undefined ? request.sessionData.account : undefined;
    if (account === undefined) {
        throw new Error('Not logged in.');
    }
    const orders = await cartApi.getOrders(account);
    const response = {
        statusCode: 200,
        body: JSON.stringify(orders),
        sessionData: {
            ...request.sessionData,
        },
    };
    return response;
};
export const getShippingMethods = async (request, actionContext) => {
    try {
        const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
        const cart = await CartFetcher.fetchCart(request, actionContext);
        const onlyMatching = request.query.onlyMatching === 'true';
        const shippingMethods = await cartApi.getShippingMethods(onlyMatching);
        const response = {
            statusCode: 200,
            body: JSON.stringify(shippingMethods),
            sessionData: {
                ...request.sessionData,
                cartId: cart.cartId,
            },
        };
        return response;
    }
    catch (e) {
        const response = {
            statusCode: 400,
            sessionData: {
                ...request.sessionData,
                cartId: null,
            },
            error: e.message,
            errorCode: 400,
        };
        return response;
    }
};
export const returnItems = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    let response;
    try {
        const { orderNumber, returnLineItems } = JSON.parse(request.body);
        const res = await cartApi.returnItems(orderNumber, returnLineItems);
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
};
export const getAvailableShippingMethods = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const cart = await CartFetcher.fetchCart(request, actionContext);
    const availableShippingMethods = await cartApi.getAvailableShippingMethods(cart);
    const response = {
        statusCode: 200,
        body: JSON.stringify(availableShippingMethods),
        sessionData: {
            ...request.sessionData,
            cartId: cart.cartId,
        },
    };
    return response;
};
export const setShippingMethod = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    let cart = await CartFetcher.fetchCart(request, actionContext);
    const shippingMethod = {
        shippingMethodId: request.query.shippingMethodId,
    };
    cart = await cartApi.setShippingMethod(cart, shippingMethod);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId: cart.cartId,
        },
    };
    return response;
};
export const addPaymentByInvoice = async (request, actionContext) => {
    var _a, _b, _c, _d;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    let cart = await CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const payment = {
        ...body.payment,
        paymentProvider: 'frontastic',
        paymentMethod: 'invoice',
        paymentStatus: PaymentStatuses.PENDING,
    };
    if (payment.amountPlanned === undefined) {
        payment.amountPlanned = {};
    }
    payment.amountPlanned.centAmount = (_b = (_a = payment.amountPlanned.centAmount) !== null && _a !== void 0 ? _a : cart.sum.centAmount) !== null && _b !== void 0 ? _b : undefined;
    payment.amountPlanned.currencyCode = (_d = (_c = payment.amountPlanned.currencyCode) !== null && _c !== void 0 ? _c : cart.sum.currencyCode) !== null && _d !== void 0 ? _d : undefined;
    cart = await cartApi.addPayment(cart, payment);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId: cart.cartId,
        },
    };
    return response;
};
export const updatePayment = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const cart = await CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const payment = await cartApi.updatePayment(cart, body.payment);
    const response = {
        statusCode: 200,
        body: JSON.stringify(payment),
        sessionData: {
            ...request.sessionData,
            cartId: cart.cartId,
        },
    };
    return response;
};
export const redeemDiscount = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const cart = await CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const result = await cartApi.redeemDiscountCode(cart, body.code);
    let response;
    if (result.data) {
        response = {
            statusCode: 200,
            body: JSON.stringify(result.data),
            sessionData: {
                ...request.sessionData,
                cartId: result.data.cartId,
            },
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
};
export const removeDiscount = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    let cart = await CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const discount = {
        discountId: body === null || body === void 0 ? void 0 : body.discountId,
    };
    cart = await cartApi.removeDiscountCode(cart, discount);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cart),
        sessionData: {
            ...request.sessionData,
            cartId: cart.cartId,
        },
    };
    return response;
};
export const replicateCart = async (request, actionContext) => {
    var _a;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const orderId = (_a = request.query) === null || _a === void 0 ? void 0 : _a['orderId'];
    try {
        if (orderId) {
            const cart = await cartApi.replicateCart(orderId);
            const order = await cartApi.order(cart);
            const response = {
                statusCode: 200,
                body: JSON.stringify(order),
                sessionData: {
                    ...request.sessionData,
                },
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
};
export const splitLineItem = async (request, actionContext) => {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const cart = await CartFetcher.fetchCart(request, actionContext);
    const body = JSON.parse(request.body);
    const cartItemsShippingAddresses = cart.itemShippingAddresses || [];
    const remainingAddresses = body.data
        .map((item) => item.address)
        .filter((addressSplit) => cartItemsShippingAddresses.findIndex((address) => address.key === addressSplit.id) === -1);
    if (remainingAddresses.length) {
        for await (const address of remainingAddresses) {
            await cartApi.addItemShippingAddress(cart, address);
        }
    }
    const target = body.data.map((item) => ({ addressKey: item.address.id, quantity: item.quantity }));
    const cartData = await cartApi.updateLineItemShippingDetails(cart.cartId, body.lineItemId, target);
    const response = {
        statusCode: 200,
        body: JSON.stringify(cartData),
        sessionData: {
            ...request.sessionData,
            cartId: cart.cartId,
        },
    };
    return response;
};
//# sourceMappingURL=CartController.js.map