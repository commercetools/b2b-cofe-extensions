"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStoreRefs = exports.mapReferencedAssociates = exports.addBUsinessUnitAdminFlags = exports.isUserRootAdminInBusinessUnit = exports.isUserAdminInBusinessUnit = exports.mapBusinessUnitToBusinessUnit = void 0;
const Associate_1 = require("../../../node_modules/@b2bdemo/types/build/associate/Associate");
const mapBusinessUnitToBusinessUnit = (businessUnit, allStores, accountId) => {
    const businessUnitWithAssociates = (0, exports.mapReferencedAssociates)(businessUnit);
    const businessUnitWithStores = (0, exports.mapStoreRefs)(businessUnitWithAssociates, allStores);
    const businessUnitWithFlags = accountId
        ? (0, exports.addBUsinessUnitAdminFlags)(businessUnitWithStores, accountId)
        : businessUnitWithStores;
    return trimBusinessUnit(businessUnitWithFlags);
};
exports.mapBusinessUnitToBusinessUnit = mapBusinessUnitToBusinessUnit;
const trimBusinessUnit = (businessUnit) => {
    return {
        key: businessUnit.key,
        stores: businessUnit.stores,
        name: businessUnit.name,
        isRootAdmin: businessUnit.isRootAdmin,
        isAdmin: businessUnit.isAdmin,
        parentUnit: businessUnit.parentUnit,
        storeMode: businessUnit.storeMode,
        associates: businessUnit.associates.map((associate) => ({
            roles: associate.roles,
            customer: { id: associate.customer.id },
        })),
    };
};
const isUserAdminInBusinessUnit = (businessUnit, accountId) => {
    const currentUserAssociate = businessUnit.associates.find((associate) => associate.customer.id === accountId);
    return currentUserAssociate === null || currentUserAssociate === void 0 ? void 0 : currentUserAssociate.roles.some((role) => role === Associate_1.AssociateRole.Admin);
};
exports.isUserAdminInBusinessUnit = isUserAdminInBusinessUnit;
const isUserRootAdminInBusinessUnit = (businessUnit, accountId) => {
    if ((0, exports.isUserAdminInBusinessUnit)(businessUnit, accountId)) {
        return !businessUnit.parentUnit;
    }
    return false;
};
exports.isUserRootAdminInBusinessUnit = isUserRootAdminInBusinessUnit;
const addBUsinessUnitAdminFlags = (businessUnit, accountId = '') => {
    businessUnit.isAdmin = (0, exports.isUserAdminInBusinessUnit)(businessUnit, accountId);
    businessUnit.isRootAdmin = (0, exports.isUserRootAdminInBusinessUnit)(businessUnit, accountId);
    return businessUnit;
};
exports.addBUsinessUnitAdminFlags = addBUsinessUnitAdminFlags;
const mapReferencedAssociates = (businessUnit) => {
    var _a;
    return Object.assign(Object.assign({}, businessUnit), { associates: (_a = businessUnit.associates) === null || _a === void 0 ? void 0 : _a.map((associate) => {
            var _a, _b, _c, _d, _e, _f, _g;
            if ((_a = associate.customer) === null || _a === void 0 ? void 0 : _a.obj) {
                return {
                    roles: associate.roles,
                    customer: {
                        id: associate.customer.id,
                        typeId: 'customer',
                        firstName: (_c = (_b = associate.customer) === null || _b === void 0 ? void 0 : _b.obj) === null || _c === void 0 ? void 0 : _c.firstName,
                        lastName: (_e = (_d = associate.customer) === null || _d === void 0 ? void 0 : _d.obj) === null || _e === void 0 ? void 0 : _e.lastName,
                        email: (_g = (_f = associate.customer) === null || _f === void 0 ? void 0 : _f.obj) === null || _g === void 0 ? void 0 : _g.email,
                    },
                };
            }
            return associate;
        }) });
};
exports.mapReferencedAssociates = mapReferencedAssociates;
const mapStoreRefs = (businessUnit, allStores) => {
    var _a;
    return Object.assign(Object.assign({}, businessUnit), { stores: (_a = businessUnit.stores) === null || _a === void 0 ? void 0 : _a.map((store) => {
            const storeObj = allStores.find((s) => s.key === store.key);
            return storeObj
                ? {
                    name: storeObj.name,
                    key: storeObj.key,
                    typeId: 'store',
                    id: storeObj.id,
                }
                : store;
        }) });
};
exports.mapStoreRefs = mapStoreRefs;
//# sourceMappingURL=BusinessUnitMappers.js.map