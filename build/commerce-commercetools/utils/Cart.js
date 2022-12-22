"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadyForCheckout = exports.hasAddresses = exports.hasBillingAddress = exports.hasShippingAddress = exports.hasUser = void 0;
const hasUser = (cart) => {
    return cart.email !== undefined;
};
exports.hasUser = hasUser;
const hasShippingAddress = (cart) => {
    return (cart.shippingAddress !== undefined &&
        cart.shippingAddress.firstName !== undefined &&
        cart.shippingAddress.lastName !== undefined &&
        cart.shippingAddress.postalCode !== undefined &&
        cart.shippingAddress.city !== undefined &&
        cart.shippingAddress.country !== undefined);
};
exports.hasShippingAddress = hasShippingAddress;
const hasBillingAddress = (cart) => {
    return (cart.billingAddress !== undefined &&
        cart.billingAddress.firstName !== undefined &&
        cart.billingAddress.lastName !== undefined &&
        cart.billingAddress.postalCode !== undefined &&
        cart.billingAddress.city !== undefined &&
        cart.billingAddress.country !== undefined);
};
exports.hasBillingAddress = hasBillingAddress;
const hasAddresses = (cart) => {
    return (0, exports.hasShippingAddress)(cart) && (0, exports.hasBillingAddress)(cart);
};
exports.hasAddresses = hasAddresses;
const isReadyForCheckout = (cart) => {
    return (0, exports.hasUser)(cart) && (0, exports.hasAddresses)(cart);
};
exports.isReadyForCheckout = isReadyForCheckout;
//# sourceMappingURL=Cart.js.map