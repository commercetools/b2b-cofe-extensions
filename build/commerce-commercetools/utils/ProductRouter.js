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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const ProductApi_1 = require("../apis/ProductApi");
const Request_1 = require("./Request");
class ProductRouter {
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
        if ((_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/\/p\/([^\/]+)/)) {
            return true;
        }
        return false;
    }
    static identifyPreviewFrom(request) {
        var _b;
        if ((_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/\/preview\/.+\/p\/([^\/]+)/)) {
            return true;
        }
        return false;
    }
}
exports.ProductRouter = ProductRouter;
_a = ProductRouter;
ProductRouter.loadFor = (request, frontasticContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi_1.ProductApi(frontasticContext, (0, Request_1.getLocale)(request));
    const urlMatches = (_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/\/p\/([^\/]+)/);
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
});
ProductRouter.loadPreviewFor = (request, frontasticContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l;
    const productApi = new ProductApi_1.ProductApi(frontasticContext, (0, Request_1.getLocale)(request));
    const urlMatches = (_g = (0, Request_1.getPath)(request)) === null || _g === void 0 ? void 0 : _g.match(/\/preview\/.+\/p\/([^\/]+)/);
    if (urlMatches) {
        const productQuery = {
            skus: [urlMatches[1]],
        };
        const additionalQueryArgs = { staged: true };
        const distributionChannelId = ((_h = request.query) === null || _h === void 0 ? void 0 : _h['distributionChannelId']) || ((_l = (_k = (_j = request.sessionData) === null || _j === void 0 ? void 0 : _j.organization) === null || _k === void 0 ? void 0 : _k.distributionChannel) === null || _l === void 0 ? void 0 : _l.id);
        if (distributionChannelId) {
            additionalQueryArgs.priceChannel = distributionChannelId;
        }
        return productApi.getProduct(productQuery, additionalQueryArgs);
    }
    return null;
});
//# sourceMappingURL=ProductRouter.js.map