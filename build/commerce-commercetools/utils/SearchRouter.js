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
exports.SearchRouter = void 0;
const ProductQueryFactory_1 = require("./ProductQueryFactory");
const ProductApi_1 = require("../apis/ProductApi");
const Request_1 = require("./Request");
class SearchRouter {
    static identifyFrom(request) {
        var _b;
        const urlMatches = (_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/^\/search/);
        if (urlMatches) {
            return true;
        }
        return false;
    }
}
exports.SearchRouter = SearchRouter;
_a = SearchRouter;
SearchRouter.loadFor = (request, frontasticContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const productApi = new ProductApi_1.ProductApi(frontasticContext, (0, Request_1.getLocale)(request));
    const urlMatches = (_b = (0, Request_1.getPath)(request)) === null || _b === void 0 ? void 0 : _b.match(/\/search/);
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
        const productQuery = ProductQueryFactory_1.ProductQueryFactory.queryFromParams(Object.assign(Object.assign({}, request), { query: Object.assign(Object.assign({}, request.query), { query: request.query.query || request.query.q }) }));
        return productApi.query(productQuery, additionalQueryArgs, additionalFacets);
    }
    return null;
});
//# sourceMappingURL=SearchRouter.js.map