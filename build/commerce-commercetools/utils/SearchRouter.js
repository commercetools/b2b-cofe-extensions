var _a;
import { ProductQueryFactory } from './ProductQueryFactory';
import { ProductApi } from '../apis/ProductApi';
import { getPath, getLocale } from './Request';
export class SearchRouter {
    static identifyFrom(request) {
        var _b;
        const urlMatches = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/^\/search/);
        if (urlMatches) {
            return true;
        }
        return false;
    }
}
_a = SearchRouter;
SearchRouter.loadFor = async (request, frontasticContext) => {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi(frontasticContext, getLocale(request));
    const urlMatches = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/search/);
    const additionalQueryArgs = {};
    const additionalFacets = [
        {
            attributeId: 'categories.id',
        },
    ];
    const distributionChannelId = ((_c = request.query) === null || _c === void 0 ? void 0 : _c['distributionChannelId']) || ((_f = (_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization) === null || _e === void 0 ? void 0 : _e.distributionChannel) === null || _f === void 0 ? void 0 : _f.id);
    if (distributionChannelId) {
        additionalQueryArgs.priceChannel = distributionChannelId;
        additionalFacets.push({
            attributeId: `variants.availability.availableQuantity`,
        });
    }
    if (urlMatches) {
        const productQuery = ProductQueryFactory.queryFromParams({
            ...request,
            query: { ...request.query, query: request.query.query || request.query.q },
        });
        return productApi.query(productQuery, additionalQueryArgs, additionalFacets);
    }
    return null;
};
//# sourceMappingURL=SearchRouter.js.map