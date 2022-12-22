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
exports.CategoryRouter = void 0;
const ProductApi_1 = require("../apis/ProductApi");
const Request_1 = require("./Request");
const ProductQueryFactory_1 = require("./ProductQueryFactory");
class CategoryRouter {
    static identifyPreviewFrom(request) {
        var _b;
        if ((_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/\/preview\/(.+)/)) {
            return true;
        }
        return false;
    }
    static identifyFrom(request) {
        var _b;
        if ((_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/.+/)) {
            return true;
        }
        return false;
    }
}
exports.CategoryRouter = CategoryRouter;
_a = CategoryRouter;
CategoryRouter.loadFor = (request, frontasticContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi_1.ProductApi(frontasticContext, (0, Request_1.getLocale)(request));
    const urlMatches = (_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/[^\/]+/);
    if (urlMatches) {
        const categoryQuery = {
            slug: urlMatches[0],
        };
        const categoryQueryResult = yield productApi.queryCategories(categoryQuery);
        if (categoryQueryResult.items.length == 0)
            return null;
        request.query.category = categoryQueryResult.items[0].categoryId;
        const productQuery = ProductQueryFactory_1.ProductQueryFactory.queryFromParams(Object.assign({}, request));
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
        return yield productApi.query(productQuery, additionalQueryArgs, additionalFacets);
    }
    return null;
});
CategoryRouter.loadPreviewFor = (request, frontasticContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l;
    const productApi = new ProductApi_1.ProductApi(frontasticContext, (0, Request_1.getLocale)(request));
    const urlMatches = (_g = (0, Request_1.getPath)(request)) === null || _g === void 0 ? void 0 : _g.match(/\/preview\/(.+)/);
    if (urlMatches) {
        const categoryQuery = {
            slug: urlMatches[1],
        };
        const categoryQueryResult = yield productApi.queryCategories(categoryQuery);
        if (categoryQueryResult.items.length == 0)
            return null;
        request.query.category = categoryQueryResult.items[0].categoryId;
        const productQuery = ProductQueryFactory_1.ProductQueryFactory.queryFromParams(Object.assign({}, request));
        const additionalQueryArgs = {
            staged: true,
        };
        const distributionChannelId = ((_h = request.query) === null || _h === void 0 ? void 0 : _h['distributionChannelId']) || ((_l = (_k = (_j = request.sessionData) === null || _j === void 0 ? void 0 : _j.organization) === null || _k === void 0 ? void 0 : _k.distributionChannel) === null || _l === void 0 ? void 0 : _l.id);
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
        return yield productApi.query(productQuery, additionalQueryArgs, additionalFacets);
    }
    return null;
});
//# sourceMappingURL=CategoryRouter.js.map