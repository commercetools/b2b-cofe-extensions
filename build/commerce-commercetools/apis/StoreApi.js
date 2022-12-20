import { BaseApi } from './BaseApi';
import { mapCommercetoolsStoreToStore } from '../mappers/StoreMappers';
const convertStoreToBody = (store, locale) => {
    return {
        ...store,
        name: {
            [locale]: store.name,
        },
    };
};
export class StoreApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.create = async (store) => {
            const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.get = async (key) => {
            var _a, _b, _c;
            const locale = await this.getCommercetoolsLocal();
            const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
            try {
                return this.getApiForProject()
                    .stores()
                    .withKey({ key })
                    .get()
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsStoreToStore(response.body, locale.language, config);
                });
            }
            catch (e) {
                console.log(e);
                throw '';
            }
        };
        this.query = async (where) => {
            var _a, _b, _c;
            const locale = await this.getCommercetoolsLocal();
            const config = (_c = (_b = (_a = this.frontasticContext) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.preBuy;
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
                    return response.body.results.map((store) => mapCommercetoolsStoreToStore(store, locale.language, config));
                });
            }
            catch (e) {
                console.log(e);
                throw '';
            }
        };
    }
}
//# sourceMappingURL=StoreApi.js.map