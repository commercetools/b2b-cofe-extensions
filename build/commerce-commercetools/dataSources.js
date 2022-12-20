import { getLocale } from './utils/Request';
import { ProductApi } from './apis/ProductApi';
import { ProductQueryFactory } from './utils/ProductQueryFactory';
import { BusinessUnitApi } from './apis/BusinessUnitApi';
function productQueryFromContext(context, config) {
    var _a, _b, _c, _d;
    const productApi = new ProductApi(context.frontasticContext, context.request ? getLocale(context.request) : null);
    const additionalQueryArgs = {};
    const distributionChannelId = ((_a = context.request.query) === null || _a === void 0 ? void 0 : _a['distributionChannelId']) ||
        ((_d = (_c = (_b = context.request.sessionData) === null || _b === void 0 ? void 0 : _b.organization) === null || _c === void 0 ? void 0 : _c.distributionChannel) === null || _d === void 0 ? void 0 : _d.id);
    if (distributionChannelId) {
        additionalQueryArgs.priceChannel = distributionChannelId;
    }
    const productQuery = ProductQueryFactory.queryFromParams(context === null || context === void 0 ? void 0 : context.request, config);
    return { productApi, productQuery, additionalQueryArgs };
}
export default {
    'frontastic/categories': async (config, context) => {
        const productApi = new ProductApi(context.frontasticContext, context.request ? getLocale(context.request) : null);
        try {
            const categories = await productApi.getNavigationCategories();
            return {
                dataSourcePayload: {
                    categories,
                },
            };
        }
        catch {
            return {
                dataSourcePayload: {
                    categories: [],
                },
            };
        }
    },
    'frontastic/product-list': async (config, context) => {
        const { productApi, productQuery, additionalQueryArgs } = productQueryFromContext(context, config);
        return await productApi.query(productQuery, additionalQueryArgs).then((queryResult) => {
            return {
                dataSourcePayload: queryResult,
            };
        });
    },
    'frontastic/similar-products': async (config, context) => {
        var _a, _b, _c, _d, _e;
        if (!context.hasOwnProperty('request')) {
            throw new Error(`Request is not defined in context ${context}`);
        }
        const productApi = new ProductApi(context.frontasticContext, getLocale(context.request));
        const productQuery = ProductQueryFactory.queryFromParams(context.request, config);
        const queryWithCategoryId = {
            ...productQuery,
            category: (_e = (_d = (_c = (_b = (_a = context.pageFolder.dataSourceConfigurations.find((stream) => stream.streamId === '__master')) === null || _a === void 0 ? void 0 : _a.preloadedValue) === null || _b === void 0 ? void 0 : _b.product) === null || _c === void 0 ? void 0 : _c.categories) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.categoryId,
        };
        return await productApi.query(queryWithCategoryId).then((queryResult) => {
            return {
                dataSourcePayload: queryResult,
            };
        });
    },
    'frontastic/product': async (config, context) => {
        const { productApi, productQuery, additionalQueryArgs } = productQueryFromContext(context, config);
        return await productApi.getProduct(productQuery, additionalQueryArgs).then((queryResult) => {
            return {
                dataSourcePayload: {
                    product: queryResult,
                },
            };
        });
    },
    'b2b/organization': (config, context) => {
        var _a;
        return {
            dataSourcePayload: {
                organization: (_a = context.request.sessionData) === null || _a === void 0 ? void 0 : _a.organization,
            },
        };
    },
    'b2b/organization-tree': async (config, context) => {
        var _a, _b;
        const businessUnitApi = new BusinessUnitApi(context.frontasticContext, context.request ? getLocale(context.request) : null);
        const tree = await businessUnitApi.getTree((_b = (_a = context.request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId);
        return {
            dataSourcePayload: {
                tree,
            },
        };
    },
};
//# sourceMappingURL=dataSources.js.map