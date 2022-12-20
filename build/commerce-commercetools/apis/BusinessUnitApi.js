import { BaseApi } from './BaseApi';
import { StoreMode } from '@Types/business-unit/BusinessUnit';
import { isUserAdminInBusinessUnit, mapBusinessUnitToBusinessUnit, mapReferencedAssociates, mapStoreRefs, } from '../mappers/BusinessUnitMappers';
import { StoreApi } from './StoreApi';
const MAX_LIMIT = 50;
export class BusinessUnitApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.getOrganizationByBusinessUnit = async (businessUnit) => {
            var _a, _b, _c;
            const organization = {};
            organization.businessUnit = businessUnit;
            if ((_a = businessUnit.stores) === null || _a === void 0 ? void 0 : _a[0]) {
                const storeApi = new StoreApi(this.frontasticContext, this.locale);
                const store = await storeApi.get((_b = businessUnit.stores) === null || _b === void 0 ? void 0 : _b[0].key);
                organization.store = store;
                if ((_c = store === null || store === void 0 ? void 0 : store.distributionChannels) === null || _c === void 0 ? void 0 : _c.length) {
                    organization.distributionChannel = store.distributionChannels[0];
                }
            }
            return organization;
        };
        this.getOrganization = async (accountId) => {
            const organization = {};
            if (accountId) {
                const businessUnit = await this.getMe(accountId);
                if (businessUnit === null || businessUnit === void 0 ? void 0 : businessUnit.key) {
                    return this.getOrganizationByBusinessUnit(businessUnit);
                }
            }
            return organization;
        };
        this.create = async (data) => {
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
        };
        this.delete = async (key) => {
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
        };
        this.update = async (key, actions) => {
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
        };
        this.query = async (where, expand) => {
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
        };
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
                ? justParents.filter((bu) => isUserAdminInBusinessUnit(bu, accountId))
                : justParents
                    .sort((a, b) => isUserAdminInBusinessUnit(a, accountId) ? -1 : isUserAdminInBusinessUnit(b, accountId) ? 1 : 0);
        };
        this.getMe = async (accountId) => {
            try {
                const storeApi = new StoreApi(this.frontasticContext, this.locale);
                const allStores = await storeApi.query();
                const response = await this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
                const highestNodes = this.getHighestNodesWithAssociation(response.results, accountId);
                if (highestNodes.length) {
                    const bu = await this.setStoresByBusinessUnit(highestNodes[0]);
                    return mapBusinessUnitToBusinessUnit(bu, allStores, accountId);
                }
                return response;
            }
            catch (e) {
                throw e;
            }
        };
        this.getByKey = async (key) => {
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
        };
        this.get = async (key, accountId) => {
            const storeApi = new StoreApi(this.frontasticContext, this.locale);
            const allStores = await storeApi.query();
            try {
                const bu = await this.getApiForProject()
                    .businessUnits()
                    .withKey({ key })
                    .get()
                    .execute()
                    .then((res) => this.setStoresByBusinessUnit(res.body));
                return mapBusinessUnitToBusinessUnit(bu, allStores, accountId);
            }
            catch (e) {
                throw e;
            }
        };
        this.setStoresByBusinessUnit = async (businessUnit) => {
            if (businessUnit.storeMode === StoreMode.Explicit) {
                return businessUnit;
            }
            let parentBU = { ...businessUnit };
            while (parentBU.storeMode === StoreMode.FromParent && !!parentBU.parentUnit) {
                const { body } = await this.getApiForProject()
                    .businessUnits()
                    .withKey({ key: parentBU.parentUnit.key })
                    .get()
                    .execute();
                parentBU = body;
            }
            if (parentBU.storeMode === StoreMode.Explicit) {
                return {
                    ...businessUnit,
                    stores: parentBU.stores,
                };
            }
            return businessUnit;
        };
        this.getTree = async (accountId) => {
            let tree = [];
            const storeApi = new StoreApi(this.frontasticContext, this.locale);
            const allStores = await storeApi.query();
            if (accountId) {
                const response = await this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
                tree = this.getHighestNodesWithAssociation(response.results, accountId, true).map((bu) => ({
                    ...bu,
                    parentUnit: null,
                }));
                if (tree.length) {
                    const { results } = await this.query(`topLevelUnit(key="${tree[0].topLevelUnit.key}")`, 'associates[*].customer');
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
            return tree.map((bu) => mapStoreRefs(mapReferencedAssociates(bu), allStores));
        };
    }
}
//# sourceMappingURL=BusinessUnitApi.js.map