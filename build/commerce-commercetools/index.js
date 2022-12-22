var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getLocale, getPath } from './utils/Request';
import { ProductRouter } from './utils/ProductRouter';
import { SearchRouter } from './utils/SearchRouter';
import { CategoryRouter } from './utils/CategoryRouter';
import dataSources from './dataSources';
import { actions } from './actionControllers';
import { BusinessUnitApi } from './apis/BusinessUnitApi';
export default {
    'dynamic-page-handler': (request, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const staticPageMatch = (_a = getPath(request)) === null || _a === void 0 ? void 0 : _a.match(/^\/(cart|checkout|wishlist|account|login|register|reset-password|thank-you)/);
        if (staticPageMatch) {
            return {
                dynamicPageType: `frontastic${staticPageMatch[0]}`,
                dataSourcePayload: {},
                pageMatchingPayload: {},
            };
        }
        const b2bPageMatch = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/^\/(business-unit|dashboard)/);
        if (b2bPageMatch) {
            let organization = (_c = request.sessionData) === null || _c === void 0 ? void 0 : _c.organization;
            if (!organization.businessUnit && ((_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.account) === null || _e === void 0 ? void 0 : _e.accountId)) {
                const businessUnitApi = new BusinessUnitApi(context.frontasticContext, getLocale(request));
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
        const quotePageMatch = (_h = getPath(request)) === null || _h === void 0 ? void 0 : _h.match(/^\/(quote-thank-you)/);
        if (quotePageMatch) {
            return {
                dynamicPageType: `b2b${quotePageMatch[0]}`,
                dataSourcePayload: {},
                pageMatchingPayload: {},
            };
        }
        if (ProductRouter.identifyPreviewFrom(request)) {
            return ProductRouter.loadPreviewFor(request, context.frontasticContext).then((product) => {
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
        if (ProductRouter.identifyFrom(request)) {
            return ProductRouter.loadFor(request, context.frontasticContext).then((product) => {
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
        if (SearchRouter.identifyFrom(request)) {
            return SearchRouter.loadFor(request, context.frontasticContext).then((result) => {
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
        if (CategoryRouter.identifyPreviewFrom(request)) {
            return CategoryRouter.loadPreviewFor(request, context.frontasticContext).then((result) => {
                if (result) {
                    return {
                        dynamicPageType: 'frontastic/category',
                        dataSourcePayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: getPath(request),
                            isPreview: true,
                        },
                        pageMatchingPayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: getPath(request),
                            isPreview: true,
                        },
                    };
                }
                return null;
            });
        }
        if (CategoryRouter.identifyFrom(request)) {
            return CategoryRouter.loadFor(request, context.frontasticContext).then((result) => {
                if (result) {
                    return {
                        dynamicPageType: 'frontastic/category',
                        dataSourcePayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: getPath(request),
                        },
                        pageMatchingPayload: {
                            totalItems: result.total,
                            items: result.items,
                            facets: result.facets,
                            previousCursor: result.previousCursor,
                            nextCursor: result.nextCursor,
                            category: getPath(request),
                        },
                    };
                }
                return null;
            });
        }
        return null;
    }),
    'data-sources': dataSources,
    actions,
};
//# sourceMappingURL=index.js.map