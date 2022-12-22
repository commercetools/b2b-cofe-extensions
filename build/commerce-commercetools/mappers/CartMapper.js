"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartMapper = void 0;
const ProductRouter_1 = require("../utils/ProductRouter");
const ProductMapper_1 = require("./ProductMapper");
class CartMapper {
}
exports.CartMapper = CartMapper;
CartMapper.commercetoolsCartToCart = (commercetoolsCart, locale, config) => {
    var _a, _b, _c;
    return {
        cartId: commercetoolsCart.id,
        cartVersion: commercetoolsCart.version.toString(),
        lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsCart.lineItems, locale),
        email: commercetoolsCart === null || commercetoolsCart === void 0 ? void 0 : commercetoolsCart.customerEmail,
        sum: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsCart.totalPrice),
        shippingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsCart.shippingAddress),
        billingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsCart.billingAddress),
        shippingInfo: CartMapper.commercetoolsShippingInfoToShippingInfo(commercetoolsCart.shippingInfo, locale),
        payments: CartMapper.commercetoolsPaymentInfoToPayments(commercetoolsCart.paymentInfo, locale),
        discountCodes: CartMapper.commercetoolsDiscountCodesInfoToDiscountCodes(commercetoolsCart.discountCodes, locale),
        directDiscounts: (_a = commercetoolsCart.directDiscounts) === null || _a === void 0 ? void 0 : _a.length,
        taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsCart.taxedPrice, locale),
        itemShippingAddresses: commercetoolsCart.itemShippingAddresses,
        origin: commercetoolsCart.origin,
        isPreBuyCart: !!config ? (_c = (_b = commercetoolsCart.custom) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[config.orderCustomField] : false,
    };
};
CartMapper.commercetoolsLineItemsToLineItems = (commercetoolsLineItems, locale) => {
    const lineItems = [];
    commercetoolsLineItems === null || commercetoolsLineItems === void 0 ? void 0 : commercetoolsLineItems.forEach((commercetoolsLineItem) => {
        var _a, _b, _c;
        const item = {
            lineItemId: commercetoolsLineItem.id,
            name: (commercetoolsLineItem === null || commercetoolsLineItem === void 0 ? void 0 : commercetoolsLineItem.name[locale.language]) || '',
            type: 'variant',
            count: commercetoolsLineItem.quantity,
            price: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney((_a = commercetoolsLineItem.price) === null || _a === void 0 ? void 0 : _a.value),
            discountedPrice: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney((_c = (_b = commercetoolsLineItem.price) === null || _b === void 0 ? void 0 : _b.discounted) === null || _c === void 0 ? void 0 : _c.value),
            discountTexts: CartMapper.commercetoolsDiscountedPricesPerQuantityToDiscountTexts(commercetoolsLineItem.discountedPricePerQuantity, locale),
            discounts: CartMapper.commercetoolsDiscountedPricesPerQuantityToDiscounts(commercetoolsLineItem.discountedPricePerQuantity, locale),
            totalPrice: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.totalPrice),
            variant: ProductMapper_1.ProductMapper.commercetoolsProductVariantToVariant(commercetoolsLineItem.variant, locale, commercetoolsLineItem.price),
            isGift: (commercetoolsLineItem === null || commercetoolsLineItem === void 0 ? void 0 : commercetoolsLineItem.lineItemMode) !== undefined && commercetoolsLineItem.lineItemMode === 'GiftLineItem',
            shippingDetails: commercetoolsLineItem.shippingDetails,
        };
        item._url = ProductRouter_1.ProductRouter.generateUrlFor(item);
        lineItems.push(item);
    });
    return lineItems;
};
CartMapper.commercetoolsAddressToAddress = (commercetoolsAddress) => {
    return {
        addressId: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.id,
        salutation: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.salutation,
        firstName: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.firstName,
        lastName: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.lastName,
        streetName: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.streetName,
        streetNumber: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.streetNumber,
        additionalStreetInfo: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.additionalStreetInfo,
        additionalAddressInfo: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.additionalAddressInfo,
        postalCode: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.postalCode,
        city: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.city,
        country: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.country,
        state: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.state,
        phone: commercetoolsAddress === null || commercetoolsAddress === void 0 ? void 0 : commercetoolsAddress.phone,
    };
};
CartMapper.addressToCommercetoolsAddress = (address) => {
    return {
        id: address === null || address === void 0 ? void 0 : address.addressId,
        salutation: address === null || address === void 0 ? void 0 : address.salutation,
        firstName: address === null || address === void 0 ? void 0 : address.firstName,
        lastName: address === null || address === void 0 ? void 0 : address.lastName,
        streetName: address === null || address === void 0 ? void 0 : address.streetName,
        streetNumber: address === null || address === void 0 ? void 0 : address.streetNumber,
        additionalStreetInfo: address === null || address === void 0 ? void 0 : address.additionalStreetInfo,
        additionalAddressInfo: address === null || address === void 0 ? void 0 : address.additionalAddressInfo,
        postalCode: address === null || address === void 0 ? void 0 : address.postalCode,
        city: address === null || address === void 0 ? void 0 : address.city,
        country: address === null || address === void 0 ? void 0 : address.country,
        state: address === null || address === void 0 ? void 0 : address.state,
        phone: address === null || address === void 0 ? void 0 : address.phone,
    };
};
CartMapper.commercetoolsOrderToOrder = (commercetoolsOrder, locale, config) => {
    var _a, _b, _c;
    return {
        cartId: commercetoolsOrder.id,
        orderState: commercetoolsOrder.orderState,
        orderId: commercetoolsOrder.orderNumber,
        orderVersion: commercetoolsOrder.version.toString(),
        lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsOrder.lineItems, locale),
        email: commercetoolsOrder === null || commercetoolsOrder === void 0 ? void 0 : commercetoolsOrder.customerEmail,
        shippingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsOrder.shippingAddress),
        billingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsOrder.billingAddress),
        sum: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsOrder.totalPrice),
        businessUnit: (_a = commercetoolsOrder.businessUnit) === null || _a === void 0 ? void 0 : _a.key,
        createdAt: commercetoolsOrder.createdAt,
        shippingInfo: CartMapper.commercetoolsShippingInfoToShippingInfo(commercetoolsOrder.shippingInfo, locale),
        returnInfo: CartMapper.commercetoolsReturnInfoToReturnInfo(commercetoolsOrder.returnInfo),
        isPreBuyCart: !!config ? (_c = (_b = commercetoolsOrder.custom) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[config.orderCustomField] : false,
    };
};
CartMapper.commercetoolsShippingInfoToShippingInfo = (commercetoolsShippingInfo, locale) => {
    var _a;
    if (commercetoolsShippingInfo === undefined) {
        return undefined;
    }
    let shippingMethod = {
        shippingMethodId: (_a = commercetoolsShippingInfo === null || commercetoolsShippingInfo === void 0 ? void 0 : commercetoolsShippingInfo.shippingMethod) === null || _a === void 0 ? void 0 : _a.id,
    };
    if (commercetoolsShippingInfo.shippingMethod.obj) {
        shippingMethod = Object.assign({}, CartMapper.commercetoolsShippingMethodToShippingMethod(commercetoolsShippingInfo.shippingMethod.obj, locale));
    }
    return Object.assign(Object.assign({}, shippingMethod), { price: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingInfo.price) });
};
CartMapper.commercetoolsReturnInfoToReturnInfo = (commercetoolsReturnInfo) => {
    return commercetoolsReturnInfo.map((ctReturnInfo) => ({
        returnDate: ctReturnInfo.returnDate,
        returnTrackingId: ctReturnInfo.returnTrackingId,
        items: ctReturnInfo.items.map((item) => ({
            comment: item.comment,
            createdAt: item.createdAt,
            lineItemId: item.lineItemId,
            returnInfoId: item.id,
            quantity: item.quantity,
            shipmentState: item.shipmentState,
        })),
    }));
};
CartMapper.commercetoolsShippingMethodToShippingMethod = (commercetoolsShippingMethod, locale) => {
    var _a, _b;
    return {
        shippingMethodId: (commercetoolsShippingMethod === null || commercetoolsShippingMethod === void 0 ? void 0 : commercetoolsShippingMethod.id) || undefined,
        name: ((_a = commercetoolsShippingMethod === null || commercetoolsShippingMethod === void 0 ? void 0 : commercetoolsShippingMethod.localizedName) === null || _a === void 0 ? void 0 : _a[locale.language]) || (commercetoolsShippingMethod === null || commercetoolsShippingMethod === void 0 ? void 0 : commercetoolsShippingMethod.name) || undefined,
        description: ((_b = commercetoolsShippingMethod === null || commercetoolsShippingMethod === void 0 ? void 0 : commercetoolsShippingMethod.localizedDescription) === null || _b === void 0 ? void 0 : _b[locale.language]) ||
            (commercetoolsShippingMethod === null || commercetoolsShippingMethod === void 0 ? void 0 : commercetoolsShippingMethod.description) ||
            undefined,
        rates: CartMapper.commercetoolsZoneRatesToRates(commercetoolsShippingMethod === null || commercetoolsShippingMethod === void 0 ? void 0 : commercetoolsShippingMethod.zoneRates, locale),
    };
};
CartMapper.commercetoolsZoneRatesToRates = (commercetoolsZoneRates, locale) => {
    if (commercetoolsZoneRates === undefined) {
        return undefined;
    }
    const shippingRates = [];
    commercetoolsZoneRates.forEach((commercetoolsZoneRate) => {
        var _a, _b, _c, _d, _e;
        const shippingRateId = commercetoolsZoneRate.zone.id;
        const name = ((_b = (_a = commercetoolsZoneRate.zone) === null || _a === void 0 ? void 0 : _a.obj) === null || _b === void 0 ? void 0 : _b.name) || undefined;
        const locations = (_e = (_d = (_c = commercetoolsZoneRate.zone) === null || _c === void 0 ? void 0 : _c.obj) === null || _d === void 0 ? void 0 : _d.locations) === null || _e === void 0 ? void 0 : _e.map((location) => {
            return {
                country: location.country,
                state: location.state,
            };
        });
        const matchingShippingRates = commercetoolsZoneRate.shippingRates.filter(function (shippingRate) {
            if (shippingRate.isMatching !== undefined && shippingRate.isMatching !== true) {
                return false;
            }
            return true;
        });
        matchingShippingRates.forEach((matchingShippingRates) => {
            shippingRates.push({
                shippingRateId: shippingRateId,
                name: name,
                locations: locations,
                price: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(matchingShippingRates.price),
            });
        });
    });
    return shippingRates;
};
CartMapper.commercetoolsPaymentInfoToPayments = (commercetoolsPaymentInfo, locale) => {
    var _a;
    const payments = [];
    (_a = commercetoolsPaymentInfo === null || commercetoolsPaymentInfo === void 0 ? void 0 : commercetoolsPaymentInfo.payments) === null || _a === void 0 ? void 0 : _a.forEach((commercetoolsPayment) => {
        if (commercetoolsPayment.obj) {
            payments.push(CartMapper.commercetoolsPaymentToPayment(commercetoolsPayment.obj, locale));
        }
    });
    return payments;
};
CartMapper.commercetoolsPaymentToPayment = (commercetoolsPayment, locale) => {
    var _a, _b, _c, _d, _e, _f;
    return {
        id: (_a = commercetoolsPayment.key) !== null && _a !== void 0 ? _a : null,
        paymentId: (_b = commercetoolsPayment.interfaceId) !== null && _b !== void 0 ? _b : null,
        paymentProvider: (_c = commercetoolsPayment.paymentMethodInfo.paymentInterface) !== null && _c !== void 0 ? _c : null,
        paymentMethod: (_d = commercetoolsPayment.paymentMethodInfo.method) !== null && _d !== void 0 ? _d : null,
        amountPlanned: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsPayment.amountPlanned),
        debug: JSON.stringify(commercetoolsPayment),
        paymentStatus: (_e = commercetoolsPayment.paymentStatus.interfaceCode) !== null && _e !== void 0 ? _e : null,
        version: (_f = commercetoolsPayment.version) !== null && _f !== void 0 ? _f : 0,
    };
};
CartMapper.commercetoolsDiscountCodesInfoToDiscountCodes = (commercetoolsDiscountCodesInfo, locale) => {
    const discounts = [];
    commercetoolsDiscountCodesInfo === null || commercetoolsDiscountCodesInfo === void 0 ? void 0 : commercetoolsDiscountCodesInfo.forEach((commercetoolsDiscountCodeInfo) => {
        discounts.push(CartMapper.commercetoolsDiscountCodeInfoToDiscountCode(commercetoolsDiscountCodeInfo, locale));
    });
    return discounts;
};
CartMapper.commercetoolsDiscountCodeInfoToDiscountCode = (commercetoolsDiscountCodeInfo, locale) => {
    var _a, _b;
    let discount = {
        state: commercetoolsDiscountCodeInfo.state,
    };
    if (commercetoolsDiscountCodeInfo.discountCode.obj) {
        const commercetoolsDiscountCode = commercetoolsDiscountCodeInfo.discountCode.obj;
        discount = Object.assign(Object.assign({}, discount), { discountId: commercetoolsDiscountCode.id, code: commercetoolsDiscountCode.code, name: (_a = commercetoolsDiscountCode.name[locale.language]) !== null && _a !== void 0 ? _a : undefined, description: (_b = commercetoolsDiscountCode.description[locale.language]) !== null && _b !== void 0 ? _b : undefined });
    }
    return discount;
};
CartMapper.commercetoolsDiscountedPricesPerQuantityToDiscountTexts = (commercetoolsDiscountedLineItemPricesForQuantity, locale) => {
    const discountTexts = [];
    commercetoolsDiscountedLineItemPricesForQuantity === null || commercetoolsDiscountedLineItemPricesForQuantity === void 0 ? void 0 : commercetoolsDiscountedLineItemPricesForQuantity.forEach((commercetoolsDiscountedLineItemPriceForQuantity) => {
        commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.forEach((commercetoolsDiscountedLineItemPortion) => {
            var _a;
            discountTexts.push((_a = commercetoolsDiscountedLineItemPortion.discount.obj) === null || _a === void 0 ? void 0 : _a.name[locale.language]);
        });
    });
    return discountTexts;
};
CartMapper.commercetoolsDiscountedPricesPerQuantityToDiscounts = (commercetoolsDiscountedLineItemPricesForQuantity, locale) => {
    const discounts = [];
    commercetoolsDiscountedLineItemPricesForQuantity === null || commercetoolsDiscountedLineItemPricesForQuantity === void 0 ? void 0 : commercetoolsDiscountedLineItemPricesForQuantity.forEach((commercetoolsDiscountedLineItemPriceForQuantity) => {
        commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.forEach((commercetoolsDiscountedLineItemPortion) => {
            discounts.push(CartMapper.commercetoolsDiscountedLineItemPortionToDiscount(commercetoolsDiscountedLineItemPortion, locale));
        });
    });
    return discounts;
};
CartMapper.commercetoolsDiscountedLineItemPortionToDiscount = (commercetoolsDiscountedLineItemPortion, locale) => {
    var _a, _b;
    let discount = {
        discountedAmount: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsDiscountedLineItemPortion.discountedAmount),
    };
    if (commercetoolsDiscountedLineItemPortion.discount.obj) {
        const commercetoolsCartDiscount = commercetoolsDiscountedLineItemPortion.discount.obj;
        discount = Object.assign(Object.assign({}, discount), { discountId: commercetoolsCartDiscount.id, name: (_a = commercetoolsCartDiscount.name[locale.language]) !== null && _a !== void 0 ? _a : undefined, description: (_b = commercetoolsCartDiscount.description[locale.language]) !== null && _b !== void 0 ? _b : undefined });
    }
    return discount;
};
CartMapper.commercetoolsTaxedPriceToTaxed = (commercetoolsTaxedPrice, locale) => {
    if (commercetoolsTaxedPrice === undefined) {
        return undefined;
    }
    return {
        amount: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
        taxPortions: commercetoolsTaxedPrice.taxPortions.map((commercetoolsTaxPortion) => {
            const taxPortion = {
                amount: ProductMapper_1.ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxPortion.amount),
                name: commercetoolsTaxPortion.name,
                rate: commercetoolsTaxPortion.rate,
            };
            return taxPortion;
        }),
    };
};
//# sourceMappingURL=CartMapper.js.map