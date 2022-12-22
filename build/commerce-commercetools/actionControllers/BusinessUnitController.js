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
exports.query = exports.remove = exports.getByKey = exports.update = exports.updateAssociate = exports.removeAssociate = exports.addAssociate = exports.create = exports.getBusinessUnitOrders = exports.getMyOrganization = exports.setMe = exports.getMe = void 0;
const BusinessUnit_1 = require("../../../node_modules/@b2bdemo/types/build/business-unit/BusinessUnit");
const Associate_1 = require("../../../node_modules/@b2bdemo/types/build/associate/Associate");
const BusinessUnitApi_1 = require("../apis/BusinessUnitApi");
const Request_1 = require("../utils/Request");
const CustomerApi_1 = require("../apis/CustomerApi");
const CartApi_1 = require("../apis/CartApi");
const getMe = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    let organization = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.organization;
    let businessUnit = organization === null || organization === void 0 ? void 0 : organization.businessUnit;
    if (((_c = (_b = request.sessionData) === null || _b === void 0 ? void 0 : _b.account) === null || _c === void 0 ? void 0 : _c.accountId) && !businessUnit) {
        const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
        businessUnit = yield businessUnitApi.getMe((_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.account) === null || _e === void 0 ? void 0 : _e.accountId);
        if (businessUnit) {
            organization = yield businessUnitApi.getOrganizationByBusinessUnit(businessUnit);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
    };
});
exports.getMe = getMe;
const setMe = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const data = JSON.parse(request.body);
    const businessUnit = yield businessUnitApi.get(data.key, (_g = (_f = request.sessionData) === null || _f === void 0 ? void 0 : _f.account) === null || _g === void 0 ? void 0 : _g.accountId);
    const organization = yield businessUnitApi.getOrganizationByBusinessUnit(businessUnit);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { organization }),
    };
    return response;
});
exports.setMe = setMe;
const getMyOrganization = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const allOrganization = yield businessUnitApi.getTree((_j = (_h = request.sessionData) === null || _h === void 0 ? void 0 : _h.account) === null || _j === void 0 ? void 0 : _j.accountId);
    const response = {
        statusCode: 200,
        body: JSON.stringify(allOrganization),
        sessionData: request.sessionData,
    };
    return response;
});
exports.getMyOrganization = getMyOrganization;
const getBusinessUnitOrders = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const keys = (_k = request === null || request === void 0 ? void 0 : request.query) === null || _k === void 0 ? void 0 : _k['keys'];
    if (!keys) {
        throw new Error('No keys');
    }
    const orders = yield cartApi.getBusinessUnitOrders(keys);
    const response = {
        statusCode: 200,
        body: JSON.stringify(orders),
        sessionData: request.sessionData,
    };
    return response;
});
exports.getBusinessUnitOrders = getBusinessUnitOrders;
const create = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const data = mapRequestToBusinessUnit(request);
    const store = yield businessUnitApi.create(data);
    const response = {
        statusCode: 200,
        body: JSON.stringify(store),
        sessionData: request.sessionData,
    };
    return response;
});
exports.create = create;
const addAssociate = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const customerApi = new CustomerApi_1.CustomerApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const addUserBody = JSON.parse(request.body);
    const account = yield customerApi.get(addUserBody.email);
    if (!account) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User not found' }),
            sessionData: request.sessionData,
        };
    }
    const businessUnit = yield businessUnitApi.update(request.query['key'], [
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
});
exports.addAssociate = addAssociate;
const removeAssociate = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const { id } = JSON.parse(request.body);
    const businessUnit = yield businessUnitApi.update(request.query['key'], [
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
});
exports.removeAssociate = removeAssociate;
const updateAssociate = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const { id, roles } = JSON.parse(request.body);
    const businessUnit = yield businessUnitApi.update(request.query['key'], [
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
});
exports.updateAssociate = updateAssociate;
const update = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const { key, actions } = JSON.parse(request.body);
    const businessUnit = yield businessUnitApi.update(key, actions);
    const response = {
        statusCode: 200,
        body: JSON.stringify(businessUnit),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { organization: Object.assign(Object.assign({}, (_l = request.sessionData) === null || _l === void 0 ? void 0 : _l.organization), { businessUnit }) }),
    };
    return response;
});
exports.update = update;
const getByKey = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    try {
        const businessUnit = yield businessUnitApi.getByKey((_m = request.query) === null || _m === void 0 ? void 0 : _m['key']);
        const response = {
            statusCode: 200,
            body: JSON.stringify(businessUnit),
            sessionData: request.sessionData,
        };
        return response;
    }
    catch (_o) {
        const response = {
            statusCode: 400,
            error: new Error('Business unit not found'),
            errorCode: 400,
        };
        return response;
    }
});
exports.getByKey = getByKey;
const remove = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q;
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const key = (_p = request.query) === null || _p === void 0 ? void 0 : _p['key'];
    let response;
    try {
        const businessUnit = yield businessUnitApi.delete(key);
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
            error: (_q = e === null || e === void 0 ? void 0 : e.body) === null || _q === void 0 ? void 0 : _q.message,
            errorCode: 500,
        };
    }
    return response;
});
exports.remove = remove;
const query = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let where = '';
    if ('where' in request.query) {
        where += [request.query['where']];
    }
    const store = yield businessUnitApi.query(where);
    const response = {
        statusCode: 200,
        body: JSON.stringify(store),
        sessionData: request.sessionData,
    };
    return response;
});
exports.query = query;
function mapRequestToBusinessUnit(request) {
    const businessUnitBody = JSON.parse(request.body);
    const normalizedName = businessUnitBody.account.company.toLowerCase().replace(/ /g, '_');
    const key = businessUnitBody.parentBusinessUnit
        ? `${businessUnitBody.parentBusinessUnit}_div_${normalizedName}`
        : `business_unit_${normalizedName}`;
    let storeMode = BusinessUnit_1.StoreMode.Explicit;
    let unitType = BusinessUnit_1.BusinessUnitType.Company;
    const stores = [];
    if (businessUnitBody.parentBusinessUnit && !businessUnitBody.store) {
        storeMode = BusinessUnit_1.StoreMode.FromParent;
    }
    if (businessUnitBody.parentBusinessUnit) {
        unitType = BusinessUnit_1.BusinessUnitType.Division;
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
        status: BusinessUnit_1.BusinessUnitStatus.Active,
        stores,
        storeMode,
        unitType,
        contactEmail: businessUnitBody.account.email,
        associates: [
            {
                roles: [Associate_1.AssociateRole.Admin, Associate_1.AssociateRole.Buyer],
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