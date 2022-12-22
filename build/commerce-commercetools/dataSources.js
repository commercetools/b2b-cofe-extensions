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
const Request_1 = require("./utils/Request");
const ProductApi_1 = require("./apis/ProductApi");
const ProductQueryFactory_1 = require("./utils/ProductQueryFactory");
const BusinessUnitApi_1 = require("./apis/BusinessUnitApi");
function productQueryFromContext(context, config) {
    var _a, _b, _c, _d;
    const productApi = new ProductApi_1.ProductApi(context.frontasticContext, context.request ? (0, Request_1.getLocale)(context.request) : null);
    const additionalQueryArgs = {};
    const distributionChannelId = ((_a = context.request.query) === null || _a === void 0 ? void 0 : _a['distributionChannelId']) ||
        ((_d = (_c = (_b = context.request.sessionData) === null || _b === void 0 ? void 0 : _b.organization) === null || _c === void 0 ? void 0 : _c.distributionChannel) === null || _d === void 0 ? void 0 : _d.id);
    if (distributionChannelId) {
        additionalQueryArgs.priceChannel = distributionChannelId;
    }
    const productQuery = ProductQueryFactory_1.ProductQueryFactory.queryFromParams(context === null || context === void 0 ? void 0 : context.request, config);
    return { productApi, productQuery, additionalQueryArgs };
}
exports.default = {
    'frontastic/categories': (config, context) => __awaiter(void 0, void 0, void 0, function* () {
        const productApi = new ProductApi_1.ProductApi(context.frontasticContext, context.request ? (0, Request_1.getLocale)(context.request) : null);
        try {
            const categories = yield productApi.getNavigationCategories();
            return {
                dataSourcePayload: {
                    categories,
                },
            };
        }
        catch (_a) {
            return {
                dataSourcePayload: {
                    categories: [],
                },
            };
        }
    }),
    'frontastic/product-list': (config, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { productApi, productQuery, additionalQueryArgs } = productQueryFromContext(context, config);
        return yield productApi.query(productQuery, additionalQueryArgs).then((queryResult) => {
            return {
                dataSourcePayload: queryResult,
            };
        });
    }),
    'frontastic/similar-products': (config, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c, _d, _e, _f;
        if (!context.hasOwnProperty('request')) {
            throw new Error(`Request is not defined in context ${context}`);
        }
        const productApi = new ProductApi_1.ProductApi(context.frontasticContext, (0, Request_1.getLocale)(context.request));
        const productQuery = ProductQueryFactory_1.ProductQueryFactory.queryFromParams(context.request, config);
        const queryWithCategoryId = Object.assign(Object.assign({}, productQuery), { category: (_f = (_e = (_d = (_c = (_b = context.pageFolder.dataSourceConfigurations.find((stream) => stream.streamId === '__master')) === null || _b === void 0 ? void 0 : _b.preloadedValue) === null || _c === void 0 ? void 0 : _c.product) === null || _d === void 0 ? void 0 : _d.categories) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.categoryId });
        return yield productApi.query(queryWithCategoryId).then((queryResult) => {
            return {
                dataSourcePayload: queryResult,
            };
        });
    }),
    'frontastic/product': (config, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { productApi, productQuery, additionalQueryArgs } = productQueryFromContext(context, config);
        return yield productApi.getProduct(productQuery, additionalQueryArgs).then((queryResult) => {
            return {
                dataSourcePayload: {
                    product: queryResult,
                },
            };
        });
    }),
    'b2b/organization': (config, context) => {
        var _a;
        return {
            dataSourcePayload: {
                organization: (_a = context.request.sessionData) === null || _a === void 0 ? void 0 : _a.organization,
            },
        };
    },
    'b2b/organization-tree': (config, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h;
        const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(context.frontasticContext, context.request ? (0, Request_1.getLocale)(context.request) : null);
        const tree = yield businessUnitApi.getTree((_h = (_g = context.request.sessionData) === null || _g === void 0 ? void 0 : _g.account) === null || _h === void 0 ? void 0 : _h.accountId);
        return {
            dataSourcePayload: {
                tree,
            },
        };
    }),
};
//# sourceMappingURL=dataSources.js.map