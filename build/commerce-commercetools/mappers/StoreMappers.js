"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCommercetoolsStoreToStore = void 0;
const mapCommercetoolsStoreToStore = (store, locale, config) => {
    var _a, _b, _c;
    return Object.assign(Object.assign({}, store), { name: (_a = store.name) === null || _a === void 0 ? void 0 : _a[locale], isPreBuyStore: !!config ? (_c = (_b = store.custom) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[config.storeCustomField] : false });
};
exports.mapCommercetoolsStoreToStore = mapCommercetoolsStoreToStore;
//# sourceMappingURL=StoreMappers.js.map