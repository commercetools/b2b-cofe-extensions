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
exports.BusinessUnitApi = void 0;
const BaseApi_1 = require("./BaseApi");
const BusinessUnit_1 = require("../../../node_modules/@b2bdemo/types/build/business-unit/BusinessUnit");
const BusinessUnitMappers_1 = require("../mappers/BusinessUnitMappers");
const StoreApi_1 = require("./StoreApi");
const MAX_LIMIT = 50;
class BusinessUnitApi extends BaseApi_1.BaseApi {
    constructor() {
        super(...arguments);
        this.getOrganizationByBusinessUnit = (businessUnit) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const organization = {};
            organization.businessUnit = businessUnit;
            if ((_a = businessUnit.stores) === null || _a === void 0 ? void 0 : _a[0]) {
                const storeApi = new StoreApi_1.StoreApi(this.frontasticContext, this.locale);
                const store = yield storeApi.get((_b = businessUnit.stores) === null || _b === void 0 ? void 0 : _b[0].key);
                organization.store = store;
                if ((_c = store === null || store === void 0 ? void 0 : store.distributionChannels) === null || _c === void 0 ? void 0 : _c.length) {
                    organization.distributionChannel = store.distributionChannels[0];
                }
            }
            return organization;
        });
        this.getOrganization = (accountId) => __awaiter(this, void 0, void 0, function* () {
            const organization = {};
            if (accountId) {
                const businessUnit = yield this.getMe(accountId);
                if (businessUnit === null || businessUnit === void 0 ? void 0 : businessUnit.key) {
                    return this.getOrganizationByBusinessUnit(businessUnit);
                }
            }
            return organization;
        });
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .businessUnits()
                    .post({
                    body: data,
                })
                    .execute()
                    .then((res) => res.body);
            }
            catch (e) {
                throw e;
            }
        });
        this.delete = (key) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getByKey(key).then((bu) => {
                    return this.getApiForProject()
                        .businessUnits()
                        .withKey({ key })
                        .delete({
                        queryArgs: {
                            version: bu.version,
                        },
                    })
                        .execute()
                        .then((res) => res.body);
                });
            }
            catch (e) {
                throw e;
            }
        });
        this.update = (key, actions) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getByKey(key).then((res) => {
                    return this.getApiForProject()
                        .businessUnits()
                        .withKey({ key })
                        .post({
                        body: {
                            version: res.version,
                            actions,
                        },
                    })
                        .execute()
                        .then((res) => res.body);
                });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.query = (where, expand) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .businessUnits()
                    .get({
                    queryArgs: {
                        where,
                        expand,
                        limit: MAX_LIMIT,
                    },
                })
                    .execute()
                    .then((res) => res.body);
            }
            catch (e) {
                throw e;
            }
        });
        this.getHighestNodesWithAssociation = (businessUnits, accountId, filterAdmin) => {
            if (!businessUnits.length) {
                return [];
            }
            const rootNode = businessUnits.find((bu) => !bu.parentUnit);
            if (rootNode) {
                return [rootNode];
            }
            const justParents = businessUnits
                .filter((bu) => {
                return businessUnits.findIndex((sbu) => { var _a; return sbu.key === ((_a = bu.parentUnit) === null || _a === void 0 ? void 0 : _a.key); }) === -1;
            });
            return filterAdmin
                ? justParents.filter((bu) => (0, BusinessUnitMappers_1.isUserAdminInBusinessUnit)(bu, accountId))
                : justParents
                    .sort((a, b) => (0, BusinessUnitMappers_1.isUserAdminInBusinessUnit)(a, accountId) ? -1 : (0, BusinessUnitMappers_1.isUserAdminInBusinessUnit)(b, accountId) ? 1 : 0);
        };
        this.getMe = (accountId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const storeApi = new StoreApi_1.StoreApi(this.frontasticContext, this.locale);
                const allStores = yield storeApi.query();
                const response = yield this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
                const highestNodes = this.getHighestNodesWithAssociation(response.results, accountId);
                if (highestNodes.length) {
                    const bu = yield this.setStoresByBusinessUnit(highestNodes[0]);
                    return (0, BusinessUnitMappers_1.mapBusinessUnitToBusinessUnit)(bu, allStores, accountId);
                }
                return response;
            }
            catch (e) {
                throw e;
            }
        });
        this.getByKey = (key) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .businessUnits()
                    .withKey({ key })
                    .get()
                    .execute()
                    .then((res) => res.body);
            }
            catch (e) {
                throw e;
            }
        });
        this.get = (key, accountId) => __awaiter(this, void 0, void 0, function* () {
            const storeApi = new StoreApi_1.StoreApi(this.frontasticContext, this.locale);
            const allStores = yield storeApi.query();
            try {
                const bu = yield this.getApiForProject()
                    .businessUnits()
                    .withKey({ key })
                    .get()
                    .execute()
                    .then((res) => this.setStoresByBusinessUnit(res.body));
                return (0, BusinessUnitMappers_1.mapBusinessUnitToBusinessUnit)(bu, allStores, accountId);
            }
            catch (e) {
                throw e;
            }
        });
        this.setStoresByBusinessUnit = (businessUnit) => __awaiter(this, void 0, void 0, function* () {
            if (businessUnit.storeMode === BusinessUnit_1.StoreMode.Explicit) {
                return businessUnit;
            }
            let parentBU = Object.assign({}, businessUnit);
            while (parentBU.storeMode === BusinessUnit_1.StoreMode.FromParent && !!parentBU.parentUnit) {
                const { body } = yield this.getApiForProject()
                    .businessUnits()
                    .withKey({ key: parentBU.parentUnit.key })
                    .get()
                    .execute();
                parentBU = body;
            }
            if (parentBU.storeMode === BusinessUnit_1.StoreMode.Explicit) {
                return Object.assign(Object.assign({}, businessUnit), { stores: parentBU.stores });
            }
            return businessUnit;
        });
        this.getTree = (accountId) => __awaiter(this, void 0, void 0, function* () {
            let tree = [];
            const storeApi = new StoreApi_1.StoreApi(this.frontasticContext, this.locale);
            const allStores = yield storeApi.query();
            if (accountId) {
                const response = yield this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
                tree = this.getHighestNodesWithAssociation(response.results, accountId, true).map((bu) => (Object.assign(Object.assign({}, bu), { parentUnit: null })));
                if (tree.length) {
                    const { results } = yield this.query(`topLevelUnit(key="${tree[0].topLevelUnit.key}")`, 'associates[*].customer');
                    const tempParents = [...tree];
                    while (tempParents.length) {
                        const [item] = tempParents.splice(0, 1);
                        const children = results.filter((bu) => { var _a; return ((_a = bu.parentUnit) === null || _a === void 0 ? void 0 : _a.key) === item.key; });
                        if (children.length) {
                            children.forEach((child) => {
                                tempParents.push(child);
                                tree.push(child);
                            });
                        }
                    }
                }
            }
            return tree.map((bu) => (0, BusinessUnitMappers_1.mapStoreRefs)((0, BusinessUnitMappers_1.mapReferencedAssociates)(bu), allStores));
        });
    }
}
exports.BusinessUnitApi = BusinessUnitApi;
//# sourceMappingURL=BusinessUnitApi.js.map