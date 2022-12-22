export const hasUser = (cart) => {
    return cart.email !== undefined;
};
export const hasShippingAddress = (cart) => {
    return (cart.shippingAddress !== undefined &&
        cart.shippingAddress.firstName !== undefined &&
        cart.shippingAddress.lastName !== undefined &&
        cart.shippingAddress.postalCode !== undefined &&
        cart.shippingAddress.city !== undefined &&
        cart.shippingAddress.country !== undefined);
};
export const hasBillingAddress = (cart) => {
    return (cart.billingAddress !== undefined &&
        cart.billingAddress.firstName !== undefined &&
        cart.billingAddress.lastName !== undefined &&
        cart.billingAddress.postalCode !== undefined &&
        cart.billingAddress.city !== undefined &&
        cart.billingAddress.country !== undefined);
};
export const hasAddresses = (cart) => {
    return hasShippingAddress(cart) && hasBillingAddress(cart);
};
export const isReadyForCheckout = (cart) => {
    return hasUser(cart) && hasAddresses(cart);
};
//# sourceMappingURL=Cart.js.map