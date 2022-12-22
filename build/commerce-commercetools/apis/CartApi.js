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
exports.CartApi = void 0;
const CartMapper_1 = require("../mappers/CartMapper");
const BaseApi_1 = require("./BaseApi");
const Cart_1 = require("../utils/Cart");
class CartApi extends BaseApi_1.BaseApi {
    constructor() {
        super(...arguments);
        this.getForUser = (account, organization) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .carts()
                    .get({
                    queryArgs: {
                        limit: 1,
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                        where: [
                            `customerId="${account.accountId}"`,
                            `cartState="Active"`,
                            `businessUnit(key="${organization.businessUnit.key}")`,
                            `store(key="${organization.store.key}")`,
                        ],
                        sort: 'createdAt desc',
                    },
                })
                    .execute();
                if (response.body.count >= 1) {
                    return this.buildCartWithAvailableShippingMethods(response.body.results[0], locale);
                }
                return this.createCart(account.accountId, organization);
            }
            catch (error) {
                throw new Error(`getForUser failed. ${error}`);
            }
        });
        this.createCart = (customerId, organization) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const locale = yield this.getCommercetoolsLocal();
                const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
                const cartDraft = {
                    currency: locale.currency,
                    country: locale.country,
                    locale: locale.language,
                    customerId,
                    businessUnit: {
                        key: organization.businessUnit.key,
                        typeId: 'business-unit',
                    },
                    store: {
                        key: organization.store.key,
                        typeId: 'store',
                    },
                    inventoryMode: 'ReserveOnOrder',
                };
                if (organization.store.isPreBuyStore) {
                    cartDraft.custom = {
                        type: {
                            typeId: 'type',
                            key: config.orderCustomType,
                        },
                        fields: {
                            [config.orderCustomField]: true,
                        },
                    };
                    cartDraft.inventoryMode = 'None';
                }
                const commercetoolsCart = yield this.getApiForProject()
                    .carts()
                    .post({
                    queryArgs: {
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                    },
                    body: cartDraft,
                })
                    .execute();
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart.body, locale);
            }
            catch (error) {
                throw error;
            }
        });
        this.getById = (cartId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .carts()
                    .withId({
                    ID: cartId,
                })
                    .get({
                    queryArgs: {
                        limit: 1,
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                    },
                })
                    .execute();
                return this.buildCartWithAvailableShippingMethods(response.body, locale);
            }
            catch (error) {
                throw new Error(`getById failed. ${error}`);
            }
        });
        this.addToCart = (cart, lineItem, distributionChannel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'addLineItem',
                            sku: lineItem.variant.sku,
                            quantity: +lineItem.count,
                            distributionChannel: { id: distributionChannel, typeId: 'channel' },
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`addToCart failed. ${error}`);
            }
        });
        this.addItemsToCart = (cart, lineItems, distributionChannel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: lineItems.map((lineItem) => ({
                        action: 'addLineItem',
                        sku: lineItem.variant.sku,
                        quantity: +lineItem.count,
                        distributionChannel: { id: distributionChannel, typeId: 'channel' },
                    })),
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`addToCart failed. ${error}`);
            }
        });
        this.updateLineItem = (cart, lineItem) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'changeLineItemQuantity',
                            lineItemId: lineItem.lineItemId,
                            quantity: +lineItem.count,
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`updateLineItem failed. ${error}`);
            }
        });
        this.removeLineItem = (cart, lineItem) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'removeLineItem',
                            lineItemId: lineItem.lineItemId,
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`removeLineItem failed. ${error}`);
            }
        });
        this.setEmail = (cart, email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setCustomerEmail',
                            email: email,
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setEmail failed. ${error}`);
            }
        });
        this.setCustomerId = (cart, customerId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setCustomerId',
                            customerId,
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setCustomerId failed. ${error}`);
            }
        });
        this.setLocale = (cart, localeCode) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setLocale',
                            locale: localeCode,
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setLocale failed. ${error}`);
            }
        });
        this.setShippingAddress = (cart, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setShippingAddress',
                            address: CartMapper_1.CartMapper.addressToCommercetoolsAddress(address),
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setShippingAddress failed. ${error}`);
            }
        });
        this.setBillingAddress = (cart, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setBillingAddress',
                            address: CartMapper_1.CartMapper.addressToCommercetoolsAddress(address),
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setBillingAddress failed. ${error}`);
            }
        });
        this.setShippingMethod = (cart, shippingMethod) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setShippingMethod',
                            shippingMethod: {
                                typeId: 'shipping-method',
                                id: shippingMethod.shippingMethodId,
                            },
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setShippingMethod failed. ${error}`);
            }
        });
        this.order = (cart) => __awaiter(this, void 0, void 0, function* () {
            var _d, _e, _f;
            try {
                const locale = yield this.getCommercetoolsLocal();
                const date = new Date();
                const orderFromCartDraft = {
                    id: cart.cartId,
                    version: +cart.cartVersion,
                    orderNumber: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}-${String(Date.now()).slice(-6, -1)}`,
                    orderState: cart.isPreBuyCart ? 'Open' : 'Confirmed',
                };
                if (!(0, Cart_1.isReadyForCheckout)(cart)) {
                    throw new Error('Cart not complete yet.');
                }
                const config = (_f = (_e = (_d = this.frontasticContext) === null || _d === void 0 ? void 0 : _d.project) === null || _e === void 0 ? void 0 : _e.configuration) === null || _f === void 0 ? void 0 : _f.preBuy;
                const response = yield this.getApiForProject()
                    .orders()
                    .post({
                    queryArgs: {
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                    },
                    body: orderFromCartDraft,
                })
                    .execute();
                return CartMapper_1.CartMapper.commercetoolsOrderToOrder(response.body, locale, config);
            }
            catch (error) {
                throw new Error(`order failed. ${error}`);
            }
        });
        this.getOrders = (account) => __awaiter(this, void 0, void 0, function* () {
            var _g, _h, _j;
            try {
                const locale = yield this.getCommercetoolsLocal();
                const config = (_j = (_h = (_g = this.frontasticContext) === null || _g === void 0 ? void 0 : _g.project) === null || _h === void 0 ? void 0 : _h.configuration) === null || _j === void 0 ? void 0 : _j.preBuy;
                const response = yield this.getApiForProject()
                    .orders()
                    .get({
                    queryArgs: {
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                        where: `customerId="${account.accountId}"`,
                        sort: 'createdAt desc',
                    },
                })
                    .execute();
                return response.body.results.map((order) => CartMapper_1.CartMapper.commercetoolsOrderToOrder(order, locale, config));
            }
            catch (error) {
                throw new Error(`get orders failed. ${error}`);
            }
        });
        this.getOrder = (orderNumber) => __awaiter(this, void 0, void 0, function* () {
            var _k, _l, _m;
            try {
                const locale = yield this.getCommercetoolsLocal();
                const config = (_m = (_l = (_k = this.frontasticContext) === null || _k === void 0 ? void 0 : _k.project) === null || _l === void 0 ? void 0 : _l.configuration) === null || _m === void 0 ? void 0 : _m.preBuy;
                const response = yield this.getApiForProject()
                    .orders()
                    .withOrderNumber({ orderNumber })
                    .get({
                    queryArgs: {
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                    },
                })
                    .execute();
                return CartMapper_1.CartMapper.commercetoolsOrderToOrder(response.body, locale, config);
            }
            catch (error) {
                throw new Error(`get orders failed. ${error}`);
            }
        });
        this.returnItems = (orderNumber, returnLineItems) => __awaiter(this, void 0, void 0, function* () {
            var _o, _p, _q;
            try {
                const locale = yield this.getCommercetoolsLocal();
                const config = (_q = (_p = (_o = this.frontasticContext) === null || _o === void 0 ? void 0 : _o.project) === null || _p === void 0 ? void 0 : _p.configuration) === null || _q === void 0 ? void 0 : _q.preBuy;
                const response = yield this.getOrder(orderNumber).then((order) => {
                    return this.getApiForProject()
                        .orders()
                        .withOrderNumber({ orderNumber })
                        .post({
                        body: {
                            version: +order.orderVersion,
                            actions: [
                                {
                                    action: 'addReturnInfo',
                                    items: returnLineItems,
                                    returnDate: new Date().toISOString(),
                                    returnTrackingId: new Date().getTime().toString(),
                                },
                            ],
                        },
                    })
                        .execute();
                });
                return CartMapper_1.CartMapper.commercetoolsOrderToOrder(response.body, locale, config);
            }
            catch (error) {
                throw error;
            }
        });
        this.getBusinessUnitOrders = (keys) => __awaiter(this, void 0, void 0, function* () {
            var _r, _s, _t;
            try {
                const locale = yield this.getCommercetoolsLocal();
                const config = (_t = (_s = (_r = this.frontasticContext) === null || _r === void 0 ? void 0 : _r.project) === null || _s === void 0 ? void 0 : _s.configuration) === null || _t === void 0 ? void 0 : _t.preBuy;
                const response = yield this.getApiForProject()
                    .orders()
                    .get({
                    queryArgs: {
                        expand: [
                            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                            'discountCodes[*].discountCode',
                            'paymentInfo.payments[*]',
                        ],
                        where: `businessUnit(key in (${keys}))`,
                        sort: 'createdAt desc',
                    },
                })
                    .execute();
                return response.body.results.map((order) => CartMapper_1.CartMapper.commercetoolsOrderToOrder(order, locale, config));
            }
            catch (error) {
                throw new Error(`get orders failed. ${error}`);
            }
        });
        this.getShippingMethods = (onlyMatching) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const methodArgs = {
                    queryArgs: {
                        expand: ['zoneRates[*].zone'],
                        country: undefined,
                    },
                };
                let requestBuilder = this.getApiForProject().shippingMethods().get(methodArgs);
                if (onlyMatching) {
                    methodArgs.queryArgs.country = locale.country;
                    requestBuilder = this.getApiForProject().shippingMethods().matchingLocation().get(methodArgs);
                }
                const response = yield requestBuilder.execute();
                return response.body.results.map((shippingMethod) => CartMapper_1.CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale));
            }
            catch (error) {
                throw new Error(`getShippingMethods failed. ${error}`);
            }
        });
        this.getAvailableShippingMethods = (cart) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .shippingMethods()
                    .matchingCart()
                    .get({
                    queryArgs: {
                        expand: ['zoneRates[*].zone'],
                        cartId: cart.cartId,
                    },
                })
                    .execute();
                return response.body.results.map((shippingMethod) => CartMapper_1.CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale));
            }
            catch (error) {
                throw new Error(`getAvailableShippingMethods failed. ${error}`);
            }
        });
        this.addPayment = (cart, payment) => __awaiter(this, void 0, void 0, function* () {
            let paymentDraft;
            try {
                const locale = yield this.getCommercetoolsLocal();
                paymentDraft = {
                    key: payment.id,
                    amountPlanned: {
                        centAmount: payment.amountPlanned.centAmount,
                        currencyCode: payment.amountPlanned.currencyCode,
                    },
                    interfaceId: payment.paymentId,
                    paymentMethodInfo: {
                        paymentInterface: payment.paymentProvider,
                        method: payment.paymentMethod,
                    },
                    paymentStatus: {
                        interfaceCode: payment.paymentStatus,
                        interfaceText: payment.debug,
                    },
                };
                const paymentResponse = yield this.getApiForProject()
                    .payments()
                    .post({
                    body: paymentDraft,
                })
                    .execute();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'addPayment',
                            payment: {
                                typeId: 'payment',
                                id: paymentResponse.body.id,
                            },
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`addPayment failed. ${error}, ${JSON.stringify(paymentDraft)}`);
            }
        });
        this.updatePayment = (cart, payment) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const originalPayment = cart.payments.find((cartPayment) => cartPayment.id === payment.id);
                if (originalPayment === undefined) {
                    throw new Error(`Payment ${payment.id} not found in cart ${cart.cartId}`);
                }
                const paymentUpdateActions = [];
                if (payment.paymentStatus) {
                    paymentUpdateActions.push({
                        action: 'setStatusInterfaceCode',
                        interfaceCode: payment.paymentStatus,
                    });
                }
                if (payment.debug) {
                    paymentUpdateActions.push({
                        action: 'setStatusInterfaceText',
                        interfaceText: payment.debug,
                    });
                }
                if (payment.paymentId) {
                    paymentUpdateActions.push({
                        action: 'setInterfaceId',
                        interfaceId: payment.paymentId,
                    });
                }
                if (paymentUpdateActions.length === 0) {
                    return payment;
                }
                const response = yield this.getApiForProject()
                    .payments()
                    .withKey({
                    key: originalPayment.id,
                })
                    .post({
                    body: {
                        version: originalPayment.version,
                        actions: paymentUpdateActions,
                    },
                })
                    .execute();
                return CartMapper_1.CartMapper.commercetoolsPaymentToPayment(response.body, locale);
            }
            catch (error) {
                throw new Error(`updatePayment failed. ${error}`);
            }
        });
        this.redeemDiscountCode = (cart, code) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'addDiscountCode',
                            code: code,
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                const data = yield this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
                return { statusCode: 200, data };
            }
            catch (error) {
                return {
                    statusCode: error.statusCode,
                    error: error.message,
                };
            }
        });
        this.removeDiscountCode = (cart, discount) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'removeDiscountCode',
                            discountCode: {
                                typeId: 'discount-code',
                                id: discount.discountId,
                            },
                        },
                    ],
                };
                const commercetoolsCart = yield this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`removeDiscountCode failed. ${error}`);
            }
        });
        this.buildCartWithAvailableShippingMethods = (commercetoolsCart, locale) => __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.assertCorrectLocale(commercetoolsCart, locale);
            try {
                if (cart.shippingAddress !== undefined && cart.shippingAddress.country !== undefined) {
                    cart.availableShippingMethods = yield this.getAvailableShippingMethods(cart);
                }
            }
            catch (error) {
                throw new Error(`buildCartWithAvailableShippingMethods failed. ${error}`);
            }
            return cart;
        });
        this.assertCorrectLocale = (commercetoolsCart, locale) => __awaiter(this, void 0, void 0, function* () {
            var _u, _v, _w;
            if (commercetoolsCart.totalPrice.currencyCode !== locale.currency.toLocaleUpperCase()) {
                return this.recreate(commercetoolsCart, locale);
            }
            const config = (_w = (_v = (_u = this.frontasticContext) === null || _u === void 0 ? void 0 : _u.project) === null || _v === void 0 ? void 0 : _v.configuration) === null || _w === void 0 ? void 0 : _w.preBuy;
            if (this.doesCartNeedLocaleUpdate(commercetoolsCart, locale)) {
                const cartUpdate = {
                    version: commercetoolsCart.version,
                    actions: [
                        {
                            action: 'setCountry',
                            country: locale.country,
                        },
                        {
                            action: 'setLocale',
                            country: locale.language,
                        },
                    ],
                };
                commercetoolsCart = yield this.updateCart(commercetoolsCart.id, cartUpdate, locale);
                return CartMapper_1.CartMapper.commercetoolsCartToCart(commercetoolsCart, locale, config);
            }
            return CartMapper_1.CartMapper.commercetoolsCartToCart(commercetoolsCart, locale, config);
        });
        this.recreate = (primaryCommercetoolsCart, locale) => __awaiter(this, void 0, void 0, function* () {
            const primaryCartId = primaryCommercetoolsCart.id;
            const cartVersion = primaryCommercetoolsCart.version;
            const lineItems = primaryCommercetoolsCart.lineItems;
            const cartDraft = {
                currency: locale.currency,
                country: locale.country,
                locale: locale.language,
            };
            const propertyList = [
                'customerId',
                'customerEmail',
                'customerGroup',
                'anonymousId',
                'store',
                'inventoryMode',
                'taxMode',
                'taxRoundingMode',
                'taxCalculationMode',
                'shippingAddress',
                'billingAddress',
                'shippingMethod',
                'externalTaxRateForShippingMethod',
                'deleteDaysAfterLastModification',
                'origin',
                'shippingRateInput',
                'itemShippingAddresses',
            ];
            for (const key of propertyList) {
                if (primaryCommercetoolsCart.hasOwnProperty(key)) {
                    cartDraft[key] = primaryCommercetoolsCart[key];
                }
            }
            let replicatedCommercetoolsCart = yield this.getApiForProject()
                .carts()
                .post({
                queryArgs: {
                    expand: [
                        'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                        'discountCodes[*].discountCode',
                        'paymentInfo.payments[*]',
                    ],
                },
                body: cartDraft,
            })
                .execute()
                .then((response) => {
                return response.body;
            });
            for (const lineItem of lineItems) {
                try {
                    const cartUpdate = {
                        version: +replicatedCommercetoolsCart.version,
                        actions: [
                            {
                                action: 'addLineItem',
                                sku: lineItem.variant.sku,
                                quantity: +lineItem.quantity,
                            },
                        ],
                    };
                    replicatedCommercetoolsCart = yield this.updateCart(replicatedCommercetoolsCart.id, cartUpdate, locale);
                }
                catch (error) {
                }
            }
            yield this.deleteCart(primaryCartId, cartVersion);
            return CartMapper_1.CartMapper.commercetoolsCartToCart(replicatedCommercetoolsCart, locale);
        });
        this.deleteCart = (primaryCartId, cartVersion) => __awaiter(this, void 0, void 0, function* () {
            yield this.getApiForProject()
                .carts()
                .withId({
                ID: primaryCartId,
            })
                .delete({
                queryArgs: {
                    version: cartVersion,
                },
            })
                .execute();
        });
        this.replicateCart = (orderId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject()
                    .carts()
                    .replicate()
                    .post({
                    body: {
                        reference: {
                            id: orderId,
                            typeId: 'order',
                        },
                    },
                })
                    .execute();
                return this.buildCartWithAvailableShippingMethods(response.body, locale);
            }
            catch (e) {
                throw `cannot replicate ${e}`;
            }
        });
        this.addItemShippingAddress = (originalCart, address) => __awaiter(this, void 0, void 0, function* () {
            return this.getById(originalCart.cartId).then((cart) => {
                return this.getApiForProject()
                    .carts()
                    .withId({
                    ID: cart.cartId,
                })
                    .post({
                    body: {
                        version: +cart.cartVersion,
                        actions: [
                            {
                                action: 'addItemShippingAddress',
                                address: Object.assign(Object.assign({}, address), { key: address.id }),
                            },
                        ],
                    },
                })
                    .execute();
            });
        });
        this.updateLineItemShippingDetails = (cartId, lineItemId, targets) => __awaiter(this, void 0, void 0, function* () {
            return this.getById(cartId).then((cart) => {
                return this.getApiForProject()
                    .carts()
                    .withId({
                    ID: cart.cartId,
                })
                    .post({
                    body: {
                        version: +cart.cartVersion,
                        actions: [
                            {
                                action: 'setLineItemShippingDetails',
                                lineItemId,
                                shippingDetails: {
                                    targets,
                                },
                            },
                        ],
                    },
                })
                    .execute();
            });
        });
        this.doesCartNeedLocaleUpdate = (commercetoolsCart, locale) => {
            if (commercetoolsCart.country === undefined) {
                return true;
            }
            if (commercetoolsCart.locale === undefined) {
                return true;
            }
            return commercetoolsCart.country !== locale.country || commercetoolsCart.locale !== locale.language;
        };
    }
    updateCart(cartId, cartUpdate, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getApiForProject()
                .carts()
                .withId({
                ID: cartId,
            })
                .post({
                queryArgs: {
                    expand: [
                        'lineItems[*].discountedPrice.includedDiscounts[*].discount',
                        'discountCodes[*].discountCode',
                        'paymentInfo.payments[*]',
                    ],
                },
                body: cartUpdate,
            })
                .execute()
                .then((response) => {
                return response.body;
            });
        });
    }
}
exports.CartApi = CartApi;
//# sourceMappingURL=CartApi.js.map