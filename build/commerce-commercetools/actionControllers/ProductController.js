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
exports.searchableAttributes = exports.queryCategories = exports.getAttributeGroup = exports.query = exports.getProduct = void 0;
const ProductApi_1 = require("../apis/ProductApi");
const ProductQueryFactory_1 = require("../utils/ProductQueryFactory");
const Request_1 = require("../utils/Request");
const getProduct = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const productApi = new ProductApi_1.ProductApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let productQuery = {};
    if ('id' in request.query) {
        productQuery = {
            productIds: [request.query['id']],
        };
    }
    if ('sku' in request.query) {
        productQuery = {
            skus: [request.query['sku']],
        };
    }
    const product = yield productApi.getProduct(productQuery);
    const response = {
        statusCode: 200,
        body: JSON.stringify(product),
        sessionData: request.sessionData,
    };
    return response;
});
exports.getProduct = getProduct;
const query = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const productApi = new ProductApi_1.ProductApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const productQuery = ProductQueryFactory_1.ProductQueryFactory.queryFromParams(request);
    const queryResult = yield productApi.query(productQuery);
    const response = {
        statusCode: 200,
        body: JSON.stringify(queryResult),
        sessionData: request.sessionData,
    };
    return response;
});
exports.query = query;
const getAttributeGroup = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productApi = new ProductApi_1.ProductApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    let queryResult = [];
    try {
        queryResult = yield productApi.getAttributeGroup((_a = request.query) === null || _a === void 0 ? void 0 : _a['key']);
    }
    catch (e) {
        console.log(e);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(queryResult),
        sessionData: request.sessionData,
    };
    return response;
});
exports.getAttributeGroup = getAttributeGroup;
const queryCategories = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    const productApi = new ProductApi_1.ProductApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const categoryQuery = {
        limit: (_c = (_b = request.query) === null || _b === void 0 ? void 0 : _b.limit) !== null && _c !== void 0 ? _c : undefined,
        cursor: (_e = (_d = request.query) === null || _d === void 0 ? void 0 : _d.cursor) !== null && _e !== void 0 ? _e : undefined,
        slug: (_g = (_f = request.query) === null || _f === void 0 ? void 0 : _f.slug) !== null && _g !== void 0 ? _g : undefined,
        parentId: (_j = (_h = request.query) === null || _h === void 0 ? void 0 : _h.parentId) !== null && _j !== void 0 ? _j : undefined,
    };
    const queryResult = yield productApi.queryCategories(categoryQuery);
    const response = {
        statusCode: 200,
        body: JSON.stringify(queryResult),
        sessionData: request.sessionData,
    };
    return response;
});
exports.queryCategories = queryCategories;
const searchableAttributes = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const productApi = new ProductApi_1.ProductApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const result = yield productApi.getSearchableAttributes();
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
        sessionData: request.sessionData,
    };
    return response;
});
exports.searchableAttributes = searchableAttributes;
//# sourceMappingURL=ProductController.js.map