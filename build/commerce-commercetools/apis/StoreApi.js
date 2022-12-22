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
exports.StoreApi = void 0;
const BaseApi_1 = require("./BaseApi");
const StoreMappers_1 = require("../mappers/StoreMappers");
const convertStoreToBody = (store, locale) => {
    return Object.assign(Object.assign({}, store), { name: {
            [locale]: store.name,
        } });
};
class StoreApi extends BaseApi_1.BaseApi {
    constructor() {
        super(...arguments);
        this.create = (store) => __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            const body = convertStoreToBody(store, locale.language);
            try {
                return this.getApiForProject()
                    .stores()
                    .post({
                    body,
                })
                    .execute()
                    .then((response) => {
                    return response.body;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_a) {
                throw '';
            }
        });
        this.get = (key) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d;
            const locale = yield this.getCommercetoolsLocal();
            const config = (_d = (_c = (_b = this.frontasticContext) === null || _b === void 0 ? void 0 : _b.project) === null || _c === void 0 ? void 0 : _c.configuration) === null || _d === void 0 ? void 0 : _d.preBuy;
            try {
                return this.getApiForProject()
                    .stores()
                    .withKey({ key })
                    .get()
                    .execute()
                    .then((response) => {
                    return (0, StoreMappers_1.mapCommercetoolsStoreToStore)(response.body, locale.language, config);
                });
            }
            catch (e) {
                console.log(e);
                throw '';
            }
        });
        this.query = (where) => __awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g;
            const locale = yield this.getCommercetoolsLocal();
            const config = (_g = (_f = (_e = this.frontasticContext) === null || _e === void 0 ? void 0 : _e.project) === null || _f === void 0 ? void 0 : _f.configuration) === null || _g === void 0 ? void 0 : _g.preBuy;
            const queryArgs = where
                ? {
                    where,
                }
                : {};
            try {
                return this.getApiForProject()
                    .stores()
                    .get({
                    queryArgs,
                })
                    .execute()
                    .then((response) => {
                    return response.body.results.map((store) => (0, StoreMappers_1.mapCommercetoolsStoreToStore)(store, locale.language, config));
                });
            }
            catch (e) {
                console.log(e);
                throw '';
            }
        });
    }
}
exports.StoreApi = StoreApi;
//# sourceMappingURL=StoreApi.js.map