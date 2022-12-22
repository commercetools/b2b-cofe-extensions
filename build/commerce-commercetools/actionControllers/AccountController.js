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
exports.setDefaultShippingAddress = exports.setDefaultBillingAddress = exports.removeAddress = exports.updateAddress = exports.addAddress = exports.update = exports.reset = exports.requestReset = exports.password = exports.logout = exports.login = exports.confirm = exports.resendVerificationEmail = exports.register = exports.getAccount = void 0;
const AccountApi_1 = require("../apis/AccountApi");
const CartFetcher_1 = require("../utils/CartFetcher");
const Request_1 = require("../utils/Request");
const EmailApi_1 = require("../apis/EmailApi");
const BusinessUnitApi_1 = require("../apis/BusinessUnitApi");
function loginAccount(request, actionContext, account, reverify = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
        const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
        const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext);
        try {
            const accountRes = yield accountApi.login(account, cart, reverify);
            const organization = yield businessUnitApi.getOrganization(accountRes.accountId);
            return { account: accountRes, organization };
        }
        catch (e) {
            throw e;
        }
    });
}
function assertIsAuthenticated(request) {
    const account = fetchAccountFromSession(request);
    if (account === undefined) {
        throw new Error('Not logged in.');
    }
}
function fetchAccountFromSession(request) {
    var _a;
    if (((_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) !== undefined) {
        return request.sessionData.account;
    }
    return undefined;
}
function parseBirthday(accountRegisterBody) {
    var _a, _b;
    if (accountRegisterBody.birthdayYear) {
        return new Date(+accountRegisterBody.birthdayYear, (_a = +(accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.birthdayMonth)) !== null && _a !== void 0 ? _a : 1, (_b = +(accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.birthdayDay)) !== null && _b !== void 0 ? _b : 1);
    }
    return null;
}
function mapRequestToAccount(request) {
    const accountRegisterBody = JSON.parse(request.body);
    const account = {
        email: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.email,
        confirmed: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.confirmed,
        password: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.password,
        salutation: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.salutation,
        firstName: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.firstName,
        lastName: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.lastName,
        company: accountRegisterBody === null || accountRegisterBody === void 0 ? void 0 : accountRegisterBody.company,
        birthday: parseBirthday(accountRegisterBody),
        addresses: [],
    };
    if (accountRegisterBody.billingAddress) {
        accountRegisterBody.billingAddress.isDefaultBillingAddress = true;
        accountRegisterBody.billingAddress.isDefaultShippingAddress = !(accountRegisterBody.shippingAddress !== undefined);
        account.addresses.push(accountRegisterBody.billingAddress);
    }
    if (accountRegisterBody.shippingAddress) {
        accountRegisterBody.shippingAddress.isDefaultShippingAddress = true;
        accountRegisterBody.shippingAddress.isDefaultBillingAddress = !(accountRegisterBody.billingAddress !== undefined);
        account.addresses.push(accountRegisterBody.shippingAddress);
    }
    return account;
}
const getAccount = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const account = fetchAccountFromSession(request);
    if (account === undefined) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                loggedIn: false,
            }),
        };
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            loggedIn: true,
            account,
        }),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account: account }),
    };
    return response;
});
exports.getAccount = getAccount;
const register = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const emailApi = new EmailApi_1.EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    const accountData = mapRequestToAccount(request);
    const host = JSON.parse(request.body).host;
    const cart = yield CartFetcher_1.CartFetcher.fetchCart(request, actionContext).catch(() => undefined);
    let response;
    try {
        const account = yield accountApi.create(accountData, cart);
        if (!account.confirmed)
            yield emailApi.sendVerificationEmail(account, host);
        response = {
            statusCode: 200,
            body: JSON.stringify({ accountId: account.accountId }),
            sessionData: Object.assign({}, request.sessionData),
        };
    }
    catch (e) {
        response = {
            statusCode: 400,
            error: e === null || e === void 0 ? void 0 : e.message,
            errorCode: 500,
        };
    }
    return response;
});
exports.register = register;
const resendVerificationEmail = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(request.body);
    const host = JSON.parse(request.body).host;
    const emailApi = new EmailApi_1.EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    const reverify = true;
    const { account } = yield loginAccount(request, actionContext, data, reverify);
    yield emailApi.sendVerificationEmail(account, host);
    const response = {
        statusCode: 200,
    };
    return response;
});
exports.resendVerificationEmail = resendVerificationEmail;
const confirm = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const accountConfirmBody = JSON.parse(request.body);
    const account = yield accountApi.confirmEmail(accountConfirmBody.token);
    const response = {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account: account }),
    };
    return response;
});
exports.confirm = confirm;
const login = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const accountLoginBody = JSON.parse(request.body);
    const loginInfo = {
        email: accountLoginBody.email,
        password: accountLoginBody.password,
    };
    let response;
    try {
        const { account, organization } = yield loginAccount(request, actionContext, loginInfo);
        response = {
            statusCode: 200,
            body: JSON.stringify(account),
            sessionData: Object.assign(Object.assign({}, request.sessionData), { account,
                organization }),
        };
    }
    catch (e) {
        response = {
            statusCode: 400,
            error: e === null || e === void 0 ? void 0 : e.message,
            errorCode: 500,
        };
    }
    return response;
});
exports.login = login;
const logout = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        statusCode: 200,
        body: JSON.stringify({}),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { organization: undefined, account: undefined }),
    };
});
exports.logout = logout;
const password = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const accountChangePasswordBody = JSON.parse(request.body);
    account = yield accountApi.updatePassword(account, accountChangePasswordBody.oldPassword, accountChangePasswordBody.newPassword);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.password = password;
const requestReset = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const emailApi = new EmailApi_1.EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    const accountRequestResetBody = JSON.parse(request.body);
    const passwordResetToken = yield accountApi.generatePasswordResetToken(accountRequestResetBody.email);
    yield emailApi.sendPasswordResetEmail(passwordResetToken.confirmationToken, accountRequestResetBody.email, accountRequestResetBody.host);
    return {
        statusCode: 200,
        body: JSON.stringify({}),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account: undefined }),
    };
});
exports.requestReset = requestReset;
const reset = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const accountResetBody = JSON.parse(request.body);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const newAccount = yield accountApi.resetPassword(accountResetBody.token, accountResetBody.newPassword);
    newAccount.password = accountResetBody.newPassword;
    const { account, organization } = yield loginAccount(request, actionContext, newAccount);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account,
            organization }),
    };
});
exports.reset = reset;
const update = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    account = Object.assign(Object.assign({}, account), mapRequestToAccount(request));
    account = yield accountApi.update(account);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.update = update;
const addAddress = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    account = yield accountApi.addAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.addAddress = addAddress;
const updateAddress = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    account = yield accountApi.updateAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.updateAddress = updateAddress;
const removeAddress = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    account = yield accountApi.removeAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.removeAddress = removeAddress;
const setDefaultBillingAddress = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    account = yield accountApi.setDefaultBillingAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.setDefaultBillingAddress = setDefaultBillingAddress;
const setDefaultShippingAddress = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi_1.AccountApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    account = yield accountApi.setDefaultShippingAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { account }),
    };
});
exports.setDefaultShippingAddress = setDefaultShippingAddress;
//# sourceMappingURL=AccountController.js.map