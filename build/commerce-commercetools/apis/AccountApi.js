import { BaseApi } from './BaseApi';
import { AccountMapper } from '../mappers/AccontMapper';
import { Guid } from '../utils/Guid';
export class AccountApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.create = async (account, cart) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const { commercetoolsAddresses, billingAddresses, shippingAddresses, defaultBillingAddress, defaultShippingAddress, } = this.extractAddresses(account);
                const customerDraft = {
                    email: account.email,
                    password: account.password,
                    salutation: account === null || account === void 0 ? void 0 : account.salutation,
                    firstName: account === null || account === void 0 ? void 0 : account.firstName,
                    lastName: account === null || account === void 0 ? void 0 : account.lastName,
                    companyName: account.company,
                    dateOfBirth: (account === null || account === void 0 ? void 0 : account.birthday)
                        ? account.birthday.getFullYear() + '-' + account.birthday.getMonth() + '-' + account.birthday.getDate()
                        : undefined,
                    isEmailVerified: account === null || account === void 0 ? void 0 : account.confirmed,
                    addresses: commercetoolsAddresses.length > 0 ? commercetoolsAddresses : undefined,
                    defaultBillingAddress: defaultBillingAddress,
                    defaultShippingAddress: defaultShippingAddress,
                    billingAddresses: billingAddresses.length > 0 ? billingAddresses : undefined,
                    shippingAddresses: shippingAddresses.length > 0 ? shippingAddresses : undefined,
                    anonymousCart: cart !== undefined
                        ? {
                            typeId: 'cart',
                            id: cart.cartId,
                        }
                        : undefined,
                };
                account = await this.getApiForProject()
                    .customers()
                    .post({
                    body: customerDraft,
                })
                    .execute()
                    .then((response) => {
                    return AccountMapper.commercetoolsCustomerToAccount(response.body.customer, locale);
                })
                    .catch((error) => {
                    var _a, _b, _c;
                    if (error.code && error.code === 400) {
                        if (error.body && ((_c = (_b = (_a = error.body) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.code) === 'DuplicateField') {
                            throw new Error(`The account ${account.email} does already exist.`);
                        }
                        if (cart) {
                            return this.create(account, undefined);
                        }
                    }
                    throw error;
                });
                const token = await this.generateToken(account);
                if (token) {
                    account.confirmationToken = token.value;
                    account.tokenValidUntil = new Date(token.expiresAt);
                }
                return account;
            }
            catch (error) {
                throw error;
            }
        };
        this.generateToken = async (account) => {
            const token = await this.getApiForProject()
                .customers()
                .emailToken()
                .post({
                body: {
                    id: account.accountId,
                    ttlMinutes: 2 * 7 * 24 * 60,
                },
            })
                .execute();
            return token.body;
        };
        this.confirmEmail = async (token) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                return await this.getApiForProject()
                    .customers()
                    .emailConfirm()
                    .post({
                    body: {
                        tokenValue: token,
                    },
                })
                    .execute()
                    .then((response) => {
                    return AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
                })
                    .catch((error) => {
                    throw new Error(`Failed to confirm email with token ${token}. ${error}`);
                });
            }
            catch (error) {
                throw new Error(`Confirm email failed. ${error}`);
            }
        };
        this.login = async (account, cart, reverify = false) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                account = await this.getApiForProject()
                    .login()
                    .post({
                    body: {
                        email: account.email,
                        password: account.password,
                        anonymousCart: cart !== undefined
                            ? {
                                typeId: 'cart',
                                id: cart.cartId,
                            }
                            : undefined,
                    },
                })
                    .execute()
                    .then((response) => {
                    return AccountMapper.commercetoolsCustomerToAccount(response.body.customer, locale);
                })
                    .catch((error) => {
                    var _a, _b, _c;
                    if (error.code && error.code === 400) {
                        if (error.body && ((_c = (_b = (_a = error.body) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.code) === 'InvalidCredentials') {
                            throw new Error(`Invalid credentials to login with the account ${account.email}`);
                        }
                        if (cart) {
                            return this.login(account, undefined, reverify);
                        }
                    }
                    throw new Error(`Failed to login account  ${account.email}.`);
                });
                if (reverify) {
                    const token = await this.generateToken(account);
                    account.confirmationToken = token.value;
                    account.tokenValidUntil = new Date(token.expiresAt);
                }
                else if (!account.confirmed) {
                    throw new Error(`Your account ${account.email} is not activated yet!`);
                }
                return account;
            }
            catch (error) {
                throw error;
            }
        };
        this.updatePassword = async (account, oldPassword, newPassword) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                const accountVersion = await this.fetchAccountVersion(account);
                account = await this.getApiForProject()
                    .customers()
                    .password()
                    .post({
                    body: {
                        id: account.accountId,
                        version: accountVersion,
                        currentPassword: oldPassword,
                        newPassword: newPassword,
                    },
                })
                    .execute()
                    .then((response) => {
                    return AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
                })
                    .catch((error) => {
                    throw new Error(`Failed to update password for account ${account.email}. ${error}`);
                });
                return account;
            }
            catch (error) {
                throw new Error(`updateAccount failed. ${error}`);
            }
        };
        this.generatePasswordResetToken = async (email) => {
            try {
                return await this.getApiForProject()
                    .customers()
                    .passwordToken()
                    .post({
                    body: {
                        email: email,
                        ttlMinutes: 2 * 24 * 60,
                    },
                })
                    .execute()
                    .then((response) => {
                    return {
                        email: email,
                        confirmationToken: response.body.value,
                        tokenValidUntil: new Date(response.body.expiresAt),
                    };
                })
                    .catch((error) => {
                    throw new Error(`Failed to generate reset token for account ${email}. ${error}`);
                });
            }
            catch (error) {
                throw new Error(`generatePasswordResetToken failed. ${error}`);
            }
        };
        this.resetPassword = async (token, newPassword) => {
            try {
                const locale = await this.getCommercetoolsLocal();
                return await this.getApiForProject()
                    .customers()
                    .passwordReset()
                    .post({
                    body: {
                        tokenValue: token,
                        newPassword: newPassword,
                    },
                })
                    .execute()
                    .then((response) => {
                    return AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
                })
                    .catch((error) => {
                    throw new Error(`Failed to reset password with token ${token}. ${error}`);
                });
            }
            catch (error) {
                throw new Error(`resetPassword failed. ${error}`);
            }
        };
        this.update = async (account) => {
            try {
                const customerUpdateActions = [];
                if (account.firstName) {
                    customerUpdateActions.push({ action: 'setFirstName', firstName: account.firstName });
                }
                if (account.lastName) {
                    customerUpdateActions.push({ action: 'setLastName', lastName: account.lastName });
                }
                if (account.salutation) {
                    customerUpdateActions.push({ action: 'setSalutation', salutation: account.salutation });
                }
                if (account.birthday) {
                    customerUpdateActions.push({
                        action: 'setDateOfBirth',
                        dateOfBirth: account.birthday.getFullYear() + '-' + account.birthday.getMonth() + '-' + account.birthday.getDate(),
                    });
                }
                return await this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`update failed. ${error}`);
            }
        };
        this.addAddress = async (account, address) => {
            try {
                const customerUpdateActions = [];
                let addressData = AccountMapper.addressToCommercetoolsAddress(address);
                if (addressData.id !== undefined) {
                    addressData = {
                        ...addressData,
                        id: undefined,
                    };
                }
                if (address.isDefaultBillingAddress || address.isDefaultShippingAddress) {
                    addressData = {
                        ...addressData,
                        key: Guid.newGuid(),
                    };
                }
                customerUpdateActions.push({ action: 'addAddress', address: addressData });
                if (address.isDefaultBillingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
                }
                if (address.isDefaultShippingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
                }
                return await this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`addAddress failed. ${error}`);
            }
        };
        this.updateAddress = async (account, address) => {
            try {
                const customerUpdateActions = [];
                let addressData = AccountMapper.addressToCommercetoolsAddress(address);
                if (addressData.id !== undefined) {
                    addressData = {
                        ...addressData,
                        id: undefined,
                    };
                }
                if (address.isDefaultBillingAddress || address.isDefaultShippingAddress) {
                    addressData = {
                        ...addressData,
                        key: Guid.newGuid(),
                    };
                }
                customerUpdateActions.push({ action: 'changeAddress', addressId: address.addressId, address: addressData });
                if (address.isDefaultBillingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
                }
                if (address.isDefaultShippingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
                }
                return await this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`updateAddress failed. ${error}`);
            }
        };
        this.removeAddress = async (account, address) => {
            try {
                const customerUpdateActions = [];
                const addressData = AccountMapper.addressToCommercetoolsAddress(address);
                if (addressData.id === undefined) {
                    throw new Error(`The address passed doesn't contain an id.`);
                }
                customerUpdateActions.push({ action: 'removeAddress', addressId: address.addressId });
                return await this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`removeAddress failed. ${error}`);
            }
        };
        this.setDefaultBillingAddress = async (account, address) => {
            try {
                const customerUpdateActions = [];
                const addressData = AccountMapper.addressToCommercetoolsAddress(address);
                customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressId: addressData.id });
                return await this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`setDefaultBillingAddress failed. ${error}`);
            }
        };
        this.setDefaultShippingAddress = async (account, address) => {
            try {
                const customerUpdateActions = [];
                const addressData = AccountMapper.addressToCommercetoolsAddress(address);
                customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressId: addressData.id });
                return await this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`setDefaultShippingAddress failed. ${error}`);
            }
        };
    }
    extractAddresses(account) {
        const commercetoolsAddresses = [];
        const billingAddresses = [];
        const shippingAddresses = [];
        let defaultBillingAddress;
        let defaultShippingAddress;
        account.addresses.forEach((address, key) => {
            const addressData = AccountMapper.addressToCommercetoolsAddress(address);
            commercetoolsAddresses.push(addressData);
            if (address.isDefaultBillingAddress) {
                billingAddresses.push(key);
                defaultBillingAddress = key;
            }
            if (address.isDefaultShippingAddress) {
                shippingAddresses.push(key);
                defaultShippingAddress = key;
            }
        });
        return {
            commercetoolsAddresses,
            billingAddresses,
            shippingAddresses,
            defaultBillingAddress,
            defaultShippingAddress,
        };
    }
    async fetchAccountVersion(account) {
        var _a;
        const commercetoolsAccount = await this.getApiForProject()
            .customers()
            .withId({ ID: account.accountId })
            .get()
            .execute();
        return (_a = commercetoolsAccount.body) === null || _a === void 0 ? void 0 : _a.version;
    }
    async updateAccount(account, customerUpdateActions) {
        const locale = await this.getCommercetoolsLocal();
        const accountVersion = await this.fetchAccountVersion(account);
        const customerUpdate = {
            version: accountVersion,
            actions: customerUpdateActions,
        };
        return await this.getApiForProject()
            .customers()
            .withId({ ID: account.accountId })
            .post({
            body: customerUpdate,
        })
            .execute()
            .then((response) => {
            return AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
        })
            .catch((error) => {
            throw error;
        });
    }
}
//# sourceMappingURL=AccountApi.js.map