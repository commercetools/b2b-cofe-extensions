var _a;
import { ProductApi } from '../apis/ProductApi';
import { getLocale, getPath } from './Request';
import { ProductQueryFactory } from './ProductQueryFactory';
export class CategoryRouter {
    static identifyPreviewFrom(request) {
        var _b;
        if ((_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/preview\/(.+)/)) {
            return true;
        }
        return false;
    }
    static identifyFrom(request) {
        var _b;
        if ((_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/.+/)) {
            return true;
        }
        return false;
    }
}
_a = CategoryRouter;
CategoryRouter.loadFor = async (request, frontasticContext) => {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi(frontasticContext, getLocale(request));
    const urlMatches = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/[^\/]+/);
    if (urlMatches) {
        const categoryQuery = {
            slug: urlMatches[0],
        };
        const categoryQueryResult = await productApi.queryCategories(categoryQuery);
        if (categoryQueryResult.items.length == 0)
            return null;
        request.query.category = categoryQueryResult.items[0].categoryId;
        const productQuery = ProductQueryFactory.queryFromParams({
            ...request,
        });
        const additionalQueryArgs = {};
        const distributionChannelId = ((_c = request.query) === null || _c === void 0 ? void 0 : _c['distributionChannelId']) || ((_f = (_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization) === null || _e === void 0 ? void 0 : _e.distributionChannel) === null || _f === void 0 ? void 0 : _f.id);
        const additionalFacets = [
            {
                attributeId: 'categories.id',
            },
        ];
        if (distributionChannelId) {
            additionalQueryArgs.priceChannel = distributionChannelId;
            additionalFacets.push({
                attributeId: `variants.availability.availableQuantity`,
            });
        }
        return await productApi.query(productQuery, additionalQueryArgs, additionalFacets);
    }
    return null;
};
CategoryRouter.loadPreviewFor = async (request, frontasticContext) => {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi(frontasticContext, getLocale(request));
    const urlMatches = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/preview\/(.+)/);
    if (urlMatches) {
        const categoryQuery = {
            slug: urlMatches[1],
        };
        const categoryQueryResult = await productApi.queryCategories(categoryQuery);
        if (categoryQueryResult.items.length == 0)
            return null;
        request.query.category = categoryQueryResult.items[0].categoryId;
        const productQuery = ProductQueryFactory.queryFromParams({
            ...request,
        });
        const additionalQueryArgs = {
            staged: true,
        };
        const distributionChannelId = ((_c = request.query) === null || _c === void 0 ? void 0 : _c['distributionChannelId']) || ((_f = (_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization) === null || _e === void 0 ? void 0 : _e.distributionChannel) === null || _f === void 0 ? void 0 : _f.id);
        if (distributionChannelId) {
            additionalQueryArgs.priceChannel = distributionChannelId;
        }
        const additionalFacets = [
            {
                attributeId: 'published',
                attributeType: 'boolean',
            },
            {
                attributeId: 'categories.id',
            },
        ];
        return await productApi.query(productQuery, additionalQueryArgs, additionalFacets);
    }
    return null;
};
//# sourceMappingURL=CategoryRouter.js.map