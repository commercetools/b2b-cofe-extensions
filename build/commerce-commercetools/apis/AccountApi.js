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
exports.AccountApi = void 0;
const BaseApi_1 = require("./BaseApi");
const AccontMapper_1 = require("../mappers/AccontMapper");
const Guid_1 = require("../utils/Guid");
class AccountApi extends BaseApi_1.BaseApi {
    constructor() {
        super(...arguments);
        this.create = (account, cart) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
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
                account = yield this.getApiForProject()
                    .customers()
                    .post({
                    body: customerDraft,
                })
                    .execute()
                    .then((response) => {
                    return AccontMapper_1.AccountMapper.commercetoolsCustomerToAccount(response.body.customer, locale);
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
                const token = yield this.generateToken(account);
                if (token) {
                    account.confirmationToken = token.value;
                    account.tokenValidUntil = new Date(token.expiresAt);
                }
                return account;
            }
            catch (error) {
                throw error;
            }
        });
        this.generateToken = (account) => __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getApiForProject()
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
        });
        this.confirmEmail = (token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                return yield this.getApiForProject()
                    .customers()
                    .emailConfirm()
                    .post({
                    body: {
                        tokenValue: token,
                    },
                })
                    .execute()
                    .then((response) => {
                    return AccontMapper_1.AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
                })
                    .catch((error) => {
                    throw new Error(`Failed to confirm email with token ${token}. ${error}`);
                });
            }
            catch (error) {
                throw new Error(`Confirm email failed. ${error}`);
            }
        });
        this.login = (account, cart, reverify = false) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                account = yield this.getApiForProject()
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
                    return AccontMapper_1.AccountMapper.commercetoolsCustomerToAccount(response.body.customer, locale);
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
                    const token = yield this.generateToken(account);
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
        });
        this.updatePassword = (account, oldPassword, newPassword) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const accountVersion = yield this.fetchAccountVersion(account);
                account = yield this.getApiForProject()
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
                    return AccontMapper_1.AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
                })
                    .catch((error) => {
                    throw new Error(`Failed to update password for account ${account.email}. ${error}`);
                });
                return account;
            }
            catch (error) {
                throw new Error(`updateAccount failed. ${error}`);
            }
        });
        this.generatePasswordResetToken = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getApiForProject()
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
        });
        this.resetPassword = (token, newPassword) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                return yield this.getApiForProject()
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
                    return AccontMapper_1.AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
                })
                    .catch((error) => {
                    throw new Error(`Failed to reset password with token ${token}. ${error}`);
                });
            }
            catch (error) {
                throw new Error(`resetPassword failed. ${error}`);
            }
        });
        this.update = (account) => __awaiter(this, void 0, void 0, function* () {
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
                return yield this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`update failed. ${error}`);
            }
        });
        this.addAddress = (account, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerUpdateActions = [];
                let addressData = AccontMapper_1.AccountMapper.addressToCommercetoolsAddress(address);
                if (addressData.id !== undefined) {
                    addressData = Object.assign(Object.assign({}, addressData), { id: undefined });
                }
                if (address.isDefaultBillingAddress || address.isDefaultShippingAddress) {
                    addressData = Object.assign(Object.assign({}, addressData), { key: Guid_1.Guid.newGuid() });
                }
                customerUpdateActions.push({ action: 'addAddress', address: addressData });
                if (address.isDefaultBillingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
                }
                if (address.isDefaultShippingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
                }
                return yield this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`addAddress failed. ${error}`);
            }
        });
        this.updateAddress = (account, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerUpdateActions = [];
                let addressData = AccontMapper_1.AccountMapper.addressToCommercetoolsAddress(address);
                if (addressData.id !== undefined) {
                    addressData = Object.assign(Object.assign({}, addressData), { id: undefined });
                }
                if (address.isDefaultBillingAddress || address.isDefaultShippingAddress) {
                    addressData = Object.assign(Object.assign({}, addressData), { key: Guid_1.Guid.newGuid() });
                }
                customerUpdateActions.push({ action: 'changeAddress', addressId: address.addressId, address: addressData });
                if (address.isDefaultBillingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
                }
                if (address.isDefaultShippingAddress) {
                    customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
                }
                return yield this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`updateAddress failed. ${error}`);
            }
        });
        this.removeAddress = (account, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerUpdateActions = [];
                const addressData = AccontMapper_1.AccountMapper.addressToCommercetoolsAddress(address);
                if (addressData.id === undefined) {
                    throw new Error(`The address passed doesn't contain an id.`);
                }
                customerUpdateActions.push({ action: 'removeAddress', addressId: address.addressId });
                return yield this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`removeAddress failed. ${error}`);
            }
        });
        this.setDefaultBillingAddress = (account, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerUpdateActions = [];
                const addressData = AccontMapper_1.AccountMapper.addressToCommercetoolsAddress(address);
                customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressId: addressData.id });
                return yield this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`setDefaultBillingAddress failed. ${error}`);
            }
        });
        this.setDefaultShippingAddress = (account, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerUpdateActions = [];
                const addressData = AccontMapper_1.AccountMapper.addressToCommercetoolsAddress(address);
                customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressId: addressData.id });
                return yield this.updateAccount(account, customerUpdateActions);
            }
            catch (error) {
                throw new Error(`setDefaultShippingAddress failed. ${error}`);
            }
        });
    }
    extractAddresses(account) {
        const commercetoolsAddresses = [];
        const billingAddresses = [];
        const shippingAddresses = [];
        let defaultBillingAddress;
        let defaultShippingAddress;
        account.addresses.forEach((address, key) => {
            const addressData = AccontMapper_1.AccountMapper.addressToCommercetoolsAddress(address);
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
    fetchAccountVersion(account) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const commercetoolsAccount = yield this.getApiForProject()
                .customers()
                .withId({ ID: account.accountId })
                .get()
                .execute();
            return (_a = commercetoolsAccount.body) === null || _a === void 0 ? void 0 : _a.version;
        });
    }
    updateAccount(account, customerUpdateActions) {
        return __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            const accountVersion = yield this.fetchAccountVersion(account);
            const customerUpdate = {
                version: accountVersion,
                actions: customerUpdateActions,
            };
            return yield this.getApiForProject()
                .customers()
                .withId({ ID: account.accountId })
                .post({
                body: customerUpdate,
            })
                .execute()
                .then((response) => {
                return AccontMapper_1.AccountMapper.commercetoolsCustomerToAccount(response.body, locale);
            })
                .catch((error) => {
                throw error;
            });
        });
    }
}
exports.AccountApi = AccountApi;
//# sourceMappingURL=AccountApi.js.map