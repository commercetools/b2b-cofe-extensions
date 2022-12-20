var _a;
import { ProductApi } from '../apis/ProductApi';
import { getPath, getLocale } from './Request';
export class ProductRouter {
    static isProduct(product) {
        return product.productId !== undefined;
    }
    static generateUrlFor(item) {
        if (ProductRouter.isProduct(item)) {
            return `/${item.slug}/p/${item.variants[0].sku}`;
        }
        return `/slug/p/${item.variant.sku}`;
    }
    static identifyFrom(request) {
        var _b;
        if ((_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/p\/([^\/]+)/)) {
            return true;
        }
        return false;
    }
    static identifyPreviewFrom(request) {
        var _b;
        if ((_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/preview\/.+\/p\/([^\/]+)/)) {
            return true;
        }
        return false;
    }
}
_a = ProductRouter;
ProductRouter.loadFor = async (request, frontasticContext) => {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi(frontasticContext, getLocale(request));
    const urlMatches = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/p\/([^\/]+)/);
    if (urlMatches) {
        const productQuery = {
            skus: [urlMatches[1]],
        };
        const additionalQueryArgs = {};
        const distributionChannelId = ((_c = request.query) === null || _c === void 0 ? void 0 : _c['distributionChannelId']) || ((_f = (_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization) === null || _e === void 0 ? void 0 : _e.distributionChannel) === null || _f === void 0 ? void 0 : _f.id);
        if (distributionChannelId) {
            additionalQueryArgs.priceChannel = distributionChannelId;
        }
        return productApi.getProduct(productQuery, additionalQueryArgs);
    }
    return null;
};
ProductRouter.loadPreviewFor = async (request, frontasticContext) => {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi(frontasticContext, getLocale(request));
    const urlMatches = (_b = getPath(request)) === null || _b === void 0 ? void 0 : _b.match(/\/preview\/.+\/p\/([^\/]+)/);
    if (urlMatches) {
        const productQuery = {
            skus: [urlMatches[1]],
        };
        const additionalQueryArgs = { staged: true };
        const distributionChannelId = ((_c = request.query) === null || _c === void 0 ? void 0 : _c['distributionChannelId']) || ((_f = (_e = (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization) === null || _e === void 0 ? void 0 : _e.distributionChannel) === null || _f === void 0 ? void 0 : _f.id);
        if (distributionChannelId) {
            additionalQueryArgs.priceChannel = distributionChannelId;
        }
        return productApi.getProduct(productQuery, additionalQueryArgs);
    }
    return null;
};
//# sourceMappingURL=ProductRouter.js.map