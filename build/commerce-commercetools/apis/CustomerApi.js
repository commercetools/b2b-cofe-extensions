var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseApi } from './BaseApi';
export class CustomerApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.get = (email) => __awaiter(this, void 0, void 0, function* () {
            const { body: { results }, } = yield this.getApiForProject()
                .customers()
                .get({
                queryArgs: {
                    where: `email="${email}"`,
                    limit: 1,
                },
            })
                .execute();
            return results.length ? results[0] : null;
        });
        this.getCustomerById = (id) => __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.getApiForProject().customers().withId({ ID: id }).get().execute();
            return body;
        });
    }
}
//# sourceMappingURL=CustomerApi.js.map