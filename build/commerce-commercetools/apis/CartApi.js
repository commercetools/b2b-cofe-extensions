import { CartMapper } from '../mappers/CartMapper';
import { BaseApi } from './BaseApi';
import { isReadyForCheckout } from '../utils/Cart';
export class CartApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.getForUser = async (account, organization) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
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
        };
        this.createCart = async (customerId, organization) => {
            var _a, _b, _c;
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const commercetoolsCart = await this.getApiForProject()
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
        };
        this.getById = async (cartId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
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
        };
        this.addToCart = async (cart, lineItem, distributionChannel) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`addToCart failed. ${error}`);
            }
        };
        this.addItemsToCart = async (cart, lineItems, distributionChannel) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: lineItems.map((lineItem) => ({
                        action: 'addLineItem',
                        sku: lineItem.variant.sku,
                        quantity: +lineItem.count,
                        distributionChannel: { id: distributionChannel, typeId: 'channel' },
                    })),
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`addToCart failed. ${error}`);
            }
        };
        this.updateLineItem = async (cart, lineItem) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`updateLineItem failed. ${error}`);
            }
        };
        this.removeLineItem = async (cart, lineItem) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'removeLineItem',
                            lineItemId: lineItem.lineItemId,
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`removeLineItem failed. ${error}`);
            }
        };
        this.setEmail = async (cart, email) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setCustomerEmail',
                            email: email,
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setEmail failed. ${error}`);
            }
        };
        this.setCustomerId = async (cart, customerId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setCustomerId',
                            customerId,
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setCustomerId failed. ${error}`);
            }
        };
        this.setLocale = async (cart, localeCode) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setLocale',
                            locale: localeCode,
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setLocale failed. ${error}`);
            }
        };
        this.setShippingAddress = async (cart, address) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setShippingAddress',
                            address: CartMapper.addressToCommercetoolsAddress(address),
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setShippingAddress failed. ${error}`);
            }
        };
        this.setBillingAddress = async (cart, address) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'setBillingAddress',
                            address: CartMapper.addressToCommercetoolsAddress(address),
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setBillingAddress failed. ${error}`);
            }
        };
        this.setShippingMethod = async (cart, shippingMethod) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`setShippingMethod failed. ${error}`);
            }
        };
        this.order = async (cart) => {
            var _a, _b, _c;
            try {
                const locale = await this.getCommercetoolsLocal();
                const date = new Date();
                const orderFromCartDraft = {
                    id: cart.cartId,
                    version: +cart.cartVersion,
                    orderNumber: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}-${String(Date.now()).slice(-6, -1)}`,
                    orderState: cart.isPreBuyCart ? 'Open' : 'Confirmed',
                };
                if (!isReadyForCheckout(cart)) {
                    throw new Error('Cart not complete yet.');
                }
                const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
                const response = await this.getApiForProject()
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
                return CartMapper.commercetoolsOrderToOrder(response.body, locale, config);
            }
            catch (error) {
                throw new Error(`order failed. ${error}`);
            }
        };
        this.getOrders = async (account) => {
            var _a, _b, _c;
            try {
                const locale = await this.getCommercetoolsLocal();
                const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
                const response = await this.getApiForProject()
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
                return response.body.results.map((order) => CartMapper.commercetoolsOrderToOrder(order, locale, config));
            }
            catch (error) {
                throw new Error(`get orders failed. ${error}`);
            }
        };
        this.getOrder = async (orderNumber) => {
            var _a, _b, _c;
            try {
                const locale = await this.getCommercetoolsLocal();
                const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
                const response = await this.getApiForProject()
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
                return CartMapper.commercetoolsOrderToOrder(response.body, locale, config);
            }
            catch (error) {
                throw new Error(`get orders failed. ${error}`);
            }
        };
        this.returnItems = async (orderNumber, returnLineItems) => {
            var _a, _b, _c;
            try {
                const locale = await this.getCommercetoolsLocal();
                const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
                const response = await this.getOrder(orderNumber).then((order) => {
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
                return CartMapper.commercetoolsOrderToOrder(response.body, locale, config);
            }
            catch (error) {
                throw error;
            }
        };
        this.getBusinessUnitOrders = async (keys) => {
            var _a, _b, _c;
            try {
                const locale = await this.getCommercetoolsLocal();
                const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
                const response = await this.getApiForProject()
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
                return response.body.results.map((order) => CartMapper.commercetoolsOrderToOrder(order, locale, config));
            }
            catch (error) {
                throw new Error(`get orders failed. ${error}`);
            }
        };
        this.getShippingMethods = async (onlyMatching) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const response = await requestBuilder.execute();
                return response.body.results.map((shippingMethod) => CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale));
            }
            catch (error) {
                throw new Error(`getShippingMethods failed. ${error}`);
            }
        };
        this.getAvailableShippingMethods = async (cart) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
                    .shippingMethods()
                    .matchingCart()
                    .get({
                    queryArgs: {
                        expand: ['zoneRates[*].zone'],
                        cartId: cart.cartId,
                    },
                })
                    .execute();
                return response.body.results.map((shippingMethod) => CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale));
            }
            catch (error) {
                throw new Error(`getAvailableShippingMethods failed. ${error}`);
            }
        };
        this.addPayment = async (cart, payment) => {
            let paymentDraft;
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const paymentResponse = await this.getApiForProject()
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
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`addPayment failed. ${error}, ${JSON.stringify(paymentDraft)}`);
            }
        };
        this.updatePayment = async (cart, payment) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const response = await this.getApiForProject()
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
                return CartMapper.commercetoolsPaymentToPayment(response.body, locale);
            }
            catch (error) {
                throw new Error(`updatePayment failed. ${error}`);
            }
        };
        this.redeemDiscountCode = async (cart, code) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const cartUpdate = {
                    version: +cart.cartVersion,
                    actions: [
                        {
                            action: 'addDiscountCode',
                            code: code,
                        },
                    ],
                };
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                const data = await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
                return { statusCode: 200, data };
            }
            catch (error) {
                return {
                    statusCode: error.statusCode,
                    error: error.message,
                };
            }
        };
        this.removeDiscountCode = async (cart, discount) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
                const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale);
                return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
            }
            catch (error) {
                throw new Error(`removeDiscountCode failed. ${error}`);
            }
        };
        this.buildCartWithAvailableShippingMethods = async (commercetoolsCart, locale) => {
            const cart = await this.assertCorrectLocale(commercetoolsCart, locale);
            try {
                if (cart.shippingAddress !== undefined && cart.shippingAddress.country !== undefined) {
                    cart.availableShippingMethods = await this.getAvailableShippingMethods(cart);
                }
            }
            catch (error) {
                throw new Error(`buildCartWithAvailableShippingMethods failed. ${error}`);
            }
            return cart;
        };
        this.assertCorrectLocale = async (commercetoolsCart, locale) => {
            var _a, _b, _c;
            if (commercetoolsCart.totalPrice.currencyCode !== locale.currency.toLocaleUpperCase()) {
                return this.recreate(commercetoolsCart, locale);
            }
            const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
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
                commercetoolsCart = await this.updateCart(commercetoolsCart.id, cartUpdate, locale);
                return CartMapper.commercetoolsCartToCart(commercetoolsCart, locale, config);
            }
            return CartMapper.commercetoolsCartToCart(commercetoolsCart, locale, config);
        };
        this.recreate = async (primaryCommercetoolsCart, locale) => {
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
            let replicatedCommercetoolsCart = await this.getApiForProject()
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
                    replicatedCommercetoolsCart = await this.updateCart(replicatedCommercetoolsCart.id, cartUpdate, locale);
                }
                catch (error) {
                }
            }
            await this.deleteCart(primaryCartId, cartVersion);
            return CartMapper.commercetoolsCartToCart(replicatedCommercetoolsCart, locale);
        };
        this.deleteCart = async (primaryCartId, cartVersion) => {
            await this.getApiForProject()
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
        };
        this.replicateCart = async (orderId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const response = await this.getApiForProject()
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
        };
        this.addItemShippingAddress = async (originalCart, address) => {
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
                                address: {
                                    ...address,
                                    key: address.id,
                                },
                            },
                        ],
                    },
                })
                    .execute();
            });
        };
        this.updateLineItemShippingDetails = async (cartId, lineItemId, targets) => {
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
        };
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
    async updateCart(cartId, cartUpdate, locale) {
        return await this.getApiForProject()
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
    }
}
//# sourceMappingURL=CartApi.js.map