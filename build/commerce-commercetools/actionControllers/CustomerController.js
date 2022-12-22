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
exports.getById = void 0;
const Request_1 = require("../utils/Request");
const CustomerApi_1 = require("../apis/CustomerApi");
const getById = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const customerApi = new CustomerApi_1.CustomerApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const customer = yield customerApi.getCustomerById(request.query['id']);
    const response = {
        statusCode: 200,
        body: JSON.stringify(customer),
        sessionData: request.sessionData,
    };
    return response;
});
exports.getById = getById;
//# sourceMappingURL=CustomerController.js.map