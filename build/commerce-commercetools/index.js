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
const ProductRouter_1 = require("./utils/ProductRouter");
const SearchRouter_1 = require("./utils/SearchRouter");
const CategoryRouter_1 = require("./utils/CategoryRouter");
const dataSources_1 = require("./dataSources");
const actionControllers_1 = require("./actionControllers");
const BusinessUnitApi_1 = require("./apis/BusinessUnitApi");
exports.default = {
    'dynamic-page-handler': (request, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const staticPageMatch = (_a = (0, Request_1.getPath)(request)) === null || _a === void 0 ? void 0 : _a.match(/^\/(cart|checkout|wishlist|account|login|register|reset-password|thank-you)/);
        if (staticPageMatch) {
            return {
                dynamicPageType: `frontastic${staticPageMatch[0]}`,
                dataSourcePayload: {},
                pageMatchingPayload: {},
            };
        }
        const b2bPageMatch = (_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/^\/(business-unit|dashboard)/);
        if (b2bPageMatch) {
            let organization = (_c = request.sessionData) === null || _c === void 0 ? void 0 : _c.organization;
            if (!organization.businessUnit && ((_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.account) === null || _e === void 0 ? void 0 : _e.accountId)) {
                const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(context.frontasticContext, (0, Request_1.getLocale)(request));
                organization = yield businessUnitApi.getOrganization(request.sessionData.account.accountId);
            }
            return {
                dynamicPageType: `b2b${b2bPageMatch[0]}`,
                dataSourcePayload: {
                    organization: (_f = request.sessionData) === null || _f === void 0 ? void 0 : _f.organization,
                },
                pageMatchingPayload: {
                    organization: (_g = request.sessionData) === null || _g === void 0 ? void 0 : _g.organization,
                },
            };
        }
        const quotePageMatch = (_h = (0, Request_1.getPath)(request)) === null || _h === void 0 ? void 0 : _h.match(/^\/(quote-thank-you)/);
        if (quotePageMatch) {
            return {
                dynamicPageType: `b2b${quotePageMatch[0]}`,
                dataSourcePayload: {},
                pageMatchingPayload: {},
            };
        }
        if (ProductRouter_1.ProductRouter.identifyPreviewFrom(request)) {
            return ProductRouter_1.ProductRouter.loadPreviewFor(request, context.frontasticContext).then((product) => {
                if (product) {
                    return {
                        dynamicPageType: 'frontastic/product-detail-page',
                        dataSourcePayload: {
                            product: product,
                            isPreview: true,
                        },
                        pageMatchingPayload: {
                            product: product,
                            isPreview: true,
                        },
                    };
                }
                return null;
            });
        }
        if (ProductRouter_1.ProductRouter.identifyFrom(request)) {
            return ProductRouter_1.ProductRouter.loadFor(request, context.frontasticContext).then((product) => {
                if (product) {
                    return {
                        dynamicPageType: 'frontastic/product-detail-page',
                        dataSourcePayload: {
                            product: product,
                        },
                        pageMatchingPayload: {
                            product: product,
                        },
                    };
                }
                return null;
            });
        }
        if (SearchRouter_1.SearchRouter.identifyFrom(request)) {
            return SearchRouter_1.SearchRouter.loadFor(request, context.frontasticContext).then((result) => {
                if (result) {
                    return {
                        dynamicPageType: 'frontastic/search',
                        dataSourcePayload: Object.assign({ totalItems: result.total }, result),
                        pageMatchingPayload: {
                            query: result.query,
                        },
                    };
                }
                return null;
            });
        }
        if (CategoryRouter_1.CategoryRouter.identifyPreviewFrom(request)) {
            return CategoryRouter_1.CategoryRouter.loadPreviewFor(request, context.frontasticContext).then((result) => {
                if (result) {
                    return {
                        dynamicPageType: 'frontastic/category',
                        dataSourcePayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: (0, Request_1.getPath)(request),
                            isPreview: true,
                        },
                        pageMatchingPayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: (0, Request_1.getPath)(request),
                            isPreview: true,
                        },
                    };
                }
                return null;
            });
        }
        if (CategoryRouter_1.CategoryRouter.identifyFrom(request)) {
            return CategoryRouter_1.CategoryRouter.loadFor(request, context.frontasticContext).then((result) => {
                if (result) {
                    return {
                        dynamicPageType: 'frontastic/category',
                        dataSourcePayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: (0, Request_1.getPath)(request),
                        },
                        pageMatchingPayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: (0, Request_1.getPath)(request),
                        },
                    };
                }
                return null;
            });
        }
        return null;
    }),
    'data-sources': dataSources_1.default,
    actions: actionControllers_1.actions,
};
//# sourceMappingURL=index.js.map