export class AccountMapper {
}
AccountMapper.commercetoolsCustomerToAccount = (commercetoolsCustomer, locale) => {
    return {
        accountId: commercetoolsCustomer.id,
        email: commercetoolsCustomer.email,
        salutation: commercetoolsCustomer === null || commercetoolsCustomer === void 0 ? void 0 : commercetoolsCustomer.salutation,
        firstName: commercetoolsCustomer === null || commercetoolsCustomer === void 0 ? void 0 : commercetoolsCustomer.firstName,
        lastName: commercetoolsCustomer === null || commercetoolsCustomer === void 0 ? void 0 : commercetoolsCustomer.lastName,
        birthday: (commercetoolsCustomer === null || commercetoolsCustomer === void 0 ? void 0 : commercetoolsCustomer.dateOfBirth) ? new Date(commercetoolsCustomer.dateOfBirth) : undefined,
        confirmed: commercetoolsCustomer.isEmailVerified,
        addresses: AccountMapper.commercetoolsCustomerToAddresses(commercetoolsCustomer, locale),
    };
};
AccountMapper.commercetoolsCustomerToAddresses = (commercetoolsCustomer, locale) => {
    const addresses = [];
    commercetoolsCustomer.addresses.forEach((commercetoolsAddress) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        addresses.push({
            addressId: commercetoolsAddress.id,
            salutation: (_a = commercetoolsAddress.salutation) !== null && _a !== void 0 ? _a : undefined,
            firstName: (_b = commercetoolsAddress.firstName) !== null && _b !== void 0 ? _b : undefined,
            lastName: (_c = commercetoolsAddress.lastName) !== null && _c !== void 0 ? _c : undefined,
            streetName: (_d = commercetoolsAddress.streetName) !== null && _d !== void 0 ? _d : undefined,
            streetNumber: (_e = commercetoolsAddress.streetNumber) !== null && _e !== void 0 ? _e : undefined,
            additionalStreetInfo: (_f = commercetoolsAddress.additionalStreetInfo) !== null && _f !== void 0 ? _f : undefined,
            additionalAddressInfo: (_g = commercetoolsAddress.additionalAddressInfo) !== null && _g !== void 0 ? _g : undefined,
            postalCode: (_h = commercetoolsAddress.postalCode) !== null && _h !== void 0 ? _h : undefined,
            city: (_j = commercetoolsAddress.city) !== null && _j !== void 0 ? _j : undefined,
            country: (_k = commercetoolsAddress.country) !== null && _k !== void 0 ? _k : undefined,
            state: (_l = commercetoolsAddress.state) !== null && _l !== void 0 ? _l : undefined,
            phone: (_m = commercetoolsAddress.phone) !== null && _m !== void 0 ? _m : undefined,
            isDefaultBillingAddress: commercetoolsAddress.id === commercetoolsCustomer.defaultBillingAddressId,
            isDefaultShippingAddress: commercetoolsAddress.id === commercetoolsCustomer.defaultShippingAddressId,
        });
    });
    return addresses;
};
AccountMapper.addressToCommercetoolsAddress = (address) => {
    return {
        id: address.addressId,
        salutation: address.salutation,
        firstName: address.firstName,
        lastName: address.lastName,
        streetName: address.streetName,
        streetNumber: address.streetNumber,
        additionalStreetInfo: address.additionalStreetInfo,
        additionalAddressInfo: address.additionalAddressInfo,
        postalCode: address.postalCode,
        city: address.city,
        country: address.country,
        state: address.state,
        phone: address.phone,
    };
};
//# sourceMappingURL=AccontMapper.js.map