import { BusinessUnitStatus, BusinessUnitType, StoreMode } from '@Types/business-unit/BusinessUnit';
import { AssociateRole } from '@Types/associate/Associate';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
import { getLocale } from '../utils/Request';
import { CustomerApi } from '../apis/CustomerApi';
import { CartApi } from '../apis/CartApi';
export const getMe = async (request, actionContext) => {
    var _a, _b, _c, _d, _e;
    let organization = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.organization;
    let businessUnit = organization === null || organization === void 0 ? void 0 : organization.businessUnit;
    if (((_c = (_b = request.sessionData) === null || _b === void 0 ? void 0 : _b.account) === null || _c === void 0 ? void 0 : _c.accountId) && !businessUnit) {
        const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
        businessUnit = await businessUnitApi.getMe((_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.account) === null || _e === void 0 ? void 0 : _e.accountId);
        if (businessUnit) {
            organization = await businessUnitApi.getOrganizationByBusinessUnit(businessUnit);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
    };
};
export const setMe = async (request, actionContext) => {
    var _a, _b;
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const data = JSON.parse(request.body);
    const businessUnit = await businessUnitApi.get(data.key, (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId);
    const organization = await businessUnitApi.getOrganizationByBusinessUnit(businessUnit);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: {
            ...request.sessionData,
            organization,
        },
    };
    return response;
};
export const getMyOrganization = async (request, actionContext) => {
    var _a, _b;
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const allOrganization = await businessUnitApi.getTree((_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId);
    const response = {
        statusCode: 200,
        body: JSON.stringify(allOrganization),
        sessionData: request.sessionData,
    };
    return response;
};
export const getBusinessUnitOrders = async (request, actionContext) => {
    var _a;
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const keys = (_a = request === null || request === void 0 ? void 0 : request.query) === null || _a === void 0 ? void 0 : _a['keys'];
    if (!keys) {
        throw new Error('No keys');
    }
    const orders = await cartApi.getBusinessUnitOrders(keys);
    const response = {
        statusCode: 200,
        body: JSON.stringify(orders),
        sessionData: request.sessionData,
    };
    return response;
};
export const create = async (request, actionContext) => {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const data = mapRequestToBusinessUnit(request);
    const store = await businessUnitApi.create(data);
    const response = {
        statusCode: 200,
        body: JSON.stringify(store),
        sessionData: request.sessionData,
    };
    return response;
};
export const addAssociate = async (request, actionContext) => {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const customerApi = new CustomerApi(actionContext.frontasticContext, getLocale(request));
    const addUserBody = JSON.parse(request.body);
    const account = await customerApi.get(addUserBody.email);
    if (!account) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User not found' }),
            sessionData: request.sessionData,
        };
    }
    const businessUnit = await businessUnitApi.update(request.query['key'], [
        {
            action: 'addAssociate',
            associate: {
                customer: {
                    typeId: 'customer',
                    id: account.id,
                },
                roles: addUserBody.roles,
            },
        },
    ]);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: request.sessionData,
    };
    return response;
};
export const removeAssociate = async (request, actionContext) => {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const { id } = JSON.parse(request.body);
    const businessUnit = await businessUnitApi.update(request.query['key'], [
        {
            action: 'removeAssociate',
            customer: {
                typeId: 'customer',
                id,
            },
        },
    ]);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: request.sessionData,
    };
    return response;
};
export const updateAssociate = async (request, actionContext) => {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const { id, roles } = JSON.parse(request.body);
    const businessUnit = await businessUnitApi.update(request.query['key'], [
        {
            action: 'changeAssociate',
            associate: {
                customer: {
                    typeId: 'customer',
                    id,
                },
                roles: roles,
            },
        },
    ]);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: request.sessionData,
    };
    return response;
};
export const update = async (request, actionContext) => {
    var _a;
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const { key, actions } = JSON.parse(request.body);
    const businessUnit = await businessUnitApi.update(key, actions);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: {
            ...request.sessionData,
            organization: {
                ...(_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.organization,
                businessUnit,
            },
        },
    };
    return response;
};
export const getByKey = async (request, actionContext) => {
    var _a;
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    try {
        const businessUnit = await businessUnitApi.getByKey((_a = request.query) === null || _a === void 0 ? void 0 : _a['key']);
        const response = {
            statusCode: 200,
            body: JSON.stringify(businessUnit),
            sessionData: request.sessionData,
        };
        return response;
    }
    catch {
        const response = {
            statusCode: 400,
            error: new Error('Business unit not found'),
            errorCode: 400,
        };
        return response;
    }
};
export const remove = async (request, actionContext) => {
    var _a, _b;
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const key = (_a = request.query) === null || _a === void 0 ? void 0 : _a['key'];
    let response;
    try {
        const businessUnit = await businessUnitApi.delete(key);
        response = {
            statusCode: 200,
            body: JSON.stringify(businessUnit),
            sessionData: request.sessionData,
        };
    }
    catch (e) {
        response = {
            statusCode: 400,
            sessionData: request.sessionData,
            error: (_b = e === null || e === void 0 ? void 0 : e.body) === null || _b === void 0 ? void 0 : _b.message,
            errorCode: 500,
        };
    }
    return response;
};
export const query = async (request, actionContext) => {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    let where = '';
    if ('where' in request.query) {
        where += [request.query['where']];
    }
    const store = await businessUnitApi.query(where);
    const response = {
        statusCode: 200,
        body: JSON.stringify(store),
        sessionData: request.sessionData,
    };
    return response;
};
function mapRequestToBusinessUnit(request) {
    const businessUnitBody = JSON.parse(request.body);
    const normalizedName = businessUnitBody.account.company.toLowerCase().replace(/ /g, '_');
    const key = businessUnitBody.parentBusinessUnit
        ? `${businessUnitBody.parentBusinessUnit}_div_${normalizedName}`
        : `business_unit_${normalizedName}`;
    let storeMode = StoreMode.Explicit;
    let unitType = BusinessUnitType.Company;
    const stores = [];
    if (businessUnitBody.parentBusinessUnit && !businessUnitBody.store) {
        storeMode = StoreMode.FromParent;
    }
    if (businessUnitBody.parentBusinessUnit) {
        unitType = BusinessUnitType.Division;
    }
    if (businessUnitBody.store) {
        stores.push({
            typeId: 'store',
            id: businessUnitBody.store.id,
        });
    }
    const businessUnit = {
        key,
        name: businessUnitBody.account.company,
        status: BusinessUnitStatus.Active,
        stores,
        storeMode,
        unitType,
        contactEmail: businessUnitBody.account.email,
        associates: [
            {
                roles: [AssociateRole.Admin, AssociateRole.Buyer],
                customer: {
                    id: businessUnitBody.customer.accountId,
                    typeId: 'customer',
                },
            },
        ],
    };
    if (businessUnitBody.parentBusinessUnit) {
        businessUnit.parentUnit = {
            key: businessUnitBody.parentBusinessUnit,
            typeId: 'business-unit',
        };
    }
    return businessUnit;
}
//# sourceMappingURL=BusinessUnitController.js.map