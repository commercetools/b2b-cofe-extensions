import { AccountApi } from '../apis/AccountApi';
import { CartFetcher } from '../utils/CartFetcher';
import { getLocale } from '../utils/Request';
import { EmailApi } from '../apis/EmailApi';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
async function loginAccount(request, actionContext, account, reverify = false) {
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const cart = await CartFetcher.fetchCart(request, actionContext);
    try {
        const accountRes = await accountApi.login(account, cart, reverify);
        const organization = await businessUnitApi.getOrganization(accountRes.accountId);
        return { account: accountRes, organization };
    }
    catch (e) {
        throw e;
    }
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
export const getAccount = async (request, actionContext) => {
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
        sessionData: {
            ...request.sessionData,
            account: account,
        },
    };
    return response;
};
export const register = async (request, actionContext) => {
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    const emailApi = new EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    const accountData = mapRequestToAccount(request);
    const host = JSON.parse(request.body).host;
    const cart = await CartFetcher.fetchCart(request, actionContext).catch(() => undefined);
    let response;
    try {
        const account = await accountApi.create(accountData, cart);
        if (!account.confirmed)
            await emailApi.sendVerificationEmail(account, host);
        response = {
            statusCode: 200,
            body: JSON.stringify({ accountId: account.accountId }),
            sessionData: {
                ...request.sessionData,
            },
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
};
export const resendVerificationEmail = async (request, actionContext) => {
    const data = JSON.parse(request.body);
    const host = JSON.parse(request.body).host;
    const emailApi = new EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    const reverify = true;
    const { account } = await loginAccount(request, actionContext, data, reverify);
    await emailApi.sendVerificationEmail(account, host);
    const response = {
        statusCode: 200,
    };
    return response;
};
export const confirm = async (request, actionContext) => {
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    const accountConfirmBody = JSON.parse(request.body);
    const account = await accountApi.confirmEmail(accountConfirmBody.token);
    const response = {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account: account,
        },
    };
    return response;
};
export const login = async (request, actionContext) => {
    const accountLoginBody = JSON.parse(request.body);
    const loginInfo = {
        email: accountLoginBody.email,
        password: accountLoginBody.password,
    };
    let response;
    try {
        const { account, organization } = await loginAccount(request, actionContext, loginInfo);
        response = {
            statusCode: 200,
            body: JSON.stringify(account),
            sessionData: {
                ...request.sessionData,
                account,
                organization,
            },
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
};
export const logout = async (request, actionContext) => {
    return {
        statusCode: 200,
        body: JSON.stringify({}),
        sessionData: {
            ...request.sessionData,
            organization: undefined,
            account: undefined,
        },
    };
};
export const password = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    const accountChangePasswordBody = JSON.parse(request.body);
    account = await accountApi.updatePassword(account, accountChangePasswordBody.oldPassword, accountChangePasswordBody.newPassword);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
export const requestReset = async (request, actionContext) => {
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    const emailApi = new EmailApi(actionContext.frontasticContext.project.configuration.smtp);
    const accountRequestResetBody = JSON.parse(request.body);
    const passwordResetToken = await accountApi.generatePasswordResetToken(accountRequestResetBody.email);
    await emailApi.sendPasswordResetEmail(passwordResetToken.confirmationToken, accountRequestResetBody.email, accountRequestResetBody.host);
    return {
        statusCode: 200,
        body: JSON.stringify({}),
        sessionData: {
            ...request.sessionData,
            account: undefined,
        },
    };
};
export const reset = async (request, actionContext) => {
    const accountResetBody = JSON.parse(request.body);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    const newAccount = await accountApi.resetPassword(accountResetBody.token, accountResetBody.newPassword);
    newAccount.password = accountResetBody.newPassword;
    const { account, organization } = await loginAccount(request, actionContext, newAccount);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
            organization,
        },
    };
};
export const update = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    account = {
        ...account,
        ...mapRequestToAccount(request),
    };
    account = await accountApi.update(account);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
export const addAddress = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    account = await accountApi.addAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
export const updateAddress = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    account = await accountApi.updateAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
export const removeAddress = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    account = await accountApi.removeAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
export const setDefaultBillingAddress = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    account = await accountApi.setDefaultBillingAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
export const setDefaultShippingAddress = async (request, actionContext) => {
    assertIsAuthenticated(request);
    let account = fetchAccountFromSession(request);
    const address = JSON.parse(request.body);
    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request));
    account = await accountApi.setDefaultShippingAddress(account, address);
    return {
        statusCode: 200,
        body: JSON.stringify(account),
        sessionData: {
            ...request.sessionData,
            account,
        },
    };
};
//# sourceMappingURL=AccountController.js.map