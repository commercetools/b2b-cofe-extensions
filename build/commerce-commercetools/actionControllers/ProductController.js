import { ProductApi } from '../apis/ProductApi';
import { ProductQueryFactory } from '../utils/ProductQueryFactory';
import { getLocale } from '../utils/Request';
export const getProduct = async (request, actionContext) => {
    const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request));
    let productQuery = {};
    if ('id' in request.query) {
        productQuery = {
            productIds: [request.query['id']],
        };
    }
    if ('sku' in request.query) {
        productQuery = {
            skus: [request.query['sku']],
        };
    }
    const product = await productApi.getProduct(productQuery);
    const response = {
        statusCode: 200,
        body: JSON.stringify(product),
        sessionData: request.sessionData,
    };
    return response;
};
export const query = async (request, actionContext) => {
    const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request));
    const productQuery = ProductQueryFactory.queryFromParams(request);
    const queryResult = await productApi.query(productQuery);
    const response = {
        statusCode: 200,
        body: JSON.stringify(queryResult),
        sessionData: request.sessionData,
    };
    return response;
};
export const getAttributeGroup = async (request, actionContext) => {
    var _a;
    const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request));
    let queryResult = [];
    try {
        queryResult = await productApi.getAttributeGroup((_a = request.query) === null || _a === void 0 ? void 0 : _a['key']);
    }
    catch (e) {
        console.log(e);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(queryResult),
        sessionData: request.sessionData,
    };
    return response;
};
export const queryCategories = async (request, actionContext) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request));
    const categoryQuery = {
        limit: (_b = (_a = request.query) === null || _a === void 0 ? void 0 : _a.limit) !== null && _b !== void 0 ? _b : undefined,
        cursor: (_d = (_c = request.query) === null || _c === void 0 ? void 0 : _c.cursor) !== null && _d !== void 0 ? _d : undefined,
        slug: (_f = (_e = request.query) === null || _e === void 0 ? void 0 : _e.slug) !== null && _f !== void 0 ? _f : undefined,
        parentId: (_h = (_g = request.query) === null || _g === void 0 ? void 0 : _g.parentId) !== null && _h !== void 0 ? _h : undefined,
    };
    const queryResult = await productApi.queryCategories(categoryQuery);
    const response = {
        statusCode: 200,
        body: JSON.stringify(queryResult),
        sessionData: request.sessionData,
    };
    return response;
};
export const searchableAttributes = async (request, actionContext) => {
    const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request));
    const result = await productApi.getSearchableAttributes();
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
        sessionData: request.sessionData,
    };
    return response;
};
//# sourceMappingURL=ProductController.js.map