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
exports.DashboardApi = void 0;
const BaseApi_1 = require("./BaseApi");
class DashboardApi extends BaseApi_1.BaseApi {
    constructor() {
        super(...arguments);
        this.create = (dashboard) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .customObjects()
                    .post({
                    body: dashboard,
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
        this.get = (key, container) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .customObjects()
                    .withContainerAndKey({ container, key })
                    .get()
                    .execute()
                    .then((response) => {
                    return response.body;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_b) {
                throw '';
            }
        });
    }
}
exports.DashboardApi = DashboardApi;
//# sourceMappingURL=DashboardApi.js.map