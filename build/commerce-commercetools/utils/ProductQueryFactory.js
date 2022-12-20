import { SortOrder } from '@Types/query/ProductQuery';
import { FilterTypes } from '@Types/query/Filter';
import { FilterFieldTypes } from '@Types/product/FilterField';
export class ProductQueryFactory {
    static queryParamsToFacets(queryParams) {
        const facets = [];
        let key;
        let facetData;
        for ([key, facetData] of Object.entries(queryParams.facets)) {
            if ((facetData === null || facetData === void 0 ? void 0 : facetData.terms) && !Array.isArray(facetData.terms)) {
                facetData.terms = Object.values(facetData.terms);
            }
            switch (true) {
                case facetData.min !== undefined && facetData.max !== undefined:
                    facets.push({
                        type: FilterTypes.RANGE,
                        identifier: key,
                        min: +facetData.min,
                        max: +facetData.max,
                    });
                    break;
                case facetData.terms !== undefined:
                    facets.push({
                        type: FilterTypes.TERM,
                        identifier: key,
                        terms: facetData.terms.map((facetValueData) => facetValueData),
                    });
                    break;
                case facetData.boolean !== undefined:
                    facets.push({
                        type: FilterTypes.BOOLEAN,
                        identifier: key,
                        terms: [facetData.boolean],
                    });
                    break;
                default:
                    break;
            }
        }
        return facets;
    }
    static mergeProductFiltersAndValues(queryParams) {
        var _a, _b;
        const filtersData = [];
        if (((_a = queryParams === null || queryParams === void 0 ? void 0 : queryParams.productFilters) === null || _a === void 0 ? void 0 : _a.filters) === undefined) {
            return filtersData;
        }
        if (((_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.productFilters) === null || _b === void 0 ? void 0 : _b.values) === undefined) {
            return queryParams.productFilters.filters;
        }
        queryParams.productFilters.filters.forEach((filter) => {
            var _a;
            if (filter === null || filter === void 0 ? void 0 : filter.field) {
                const filterValues = [(_a = queryParams.productFilters) === null || _a === void 0 ? void 0 : _a.values[filter.field]] || [];
                const filterData = {
                    ...filter,
                    values: filterValues,
                };
                filtersData.push(filterData);
            }
        });
        return filtersData;
    }
    static mergeCategoryFiltersAndValues(queryParams) {
        var _a, _b;
        const filtersData = [];
        if (((_a = queryParams === null || queryParams === void 0 ? void 0 : queryParams.categoryFilters) === null || _a === void 0 ? void 0 : _a.filters) === undefined) {
            return filtersData;
        }
        if (((_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.categoryFilters) === null || _b === void 0 ? void 0 : _b.values) === undefined) {
            return queryParams.categoryFilters.filters;
        }
        queryParams.categoryFilters.filters.forEach((filter) => {
            if (filter === null || filter === void 0 ? void 0 : filter.field) {
                const filterValues = [queryParams.categoryFilters.values[filter.field]] || [];
                const filterData = {
                    ...filter,
                    values: filterValues,
                };
                filtersData.push(filterData);
            }
        });
        return filtersData;
    }
}
ProductQueryFactory.queryFromParams = (request, config) => {
    var _a, _b, _c, _d;
    let queryParams;
    const filters = [];
    const productQuery = {
        productIds: [],
        skus: [],
    };
    const productIds = (_b = (_a = config === null || config === void 0 ? void 0 : config.configuration) === null || _a === void 0 ? void 0 : _a.productIds) === null || _b === void 0 ? void 0 : _b.split(',').map((val) => val.trim());
    const productSkus = (_d = (_c = config === null || config === void 0 ? void 0 : config.configuration) === null || _c === void 0 ? void 0 : _c.productSkus) === null || _d === void 0 ? void 0 : _d.split(',').map((val) => val.trim());
    if (request === null || request === void 0 ? void 0 : request.query) {
        queryParams = request.query;
    }
    if (config === null || config === void 0 ? void 0 : config.configuration) {
        queryParams = {
            ...queryParams,
            ...config.configuration,
        };
    }
    if (productSkus && productSkus.length > 0)
        queryParams.skus = productSkus;
    if (productIds && productIds.length > 0)
        queryParams.productIds = productIds;
    productQuery.query = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.query) || undefined;
    productQuery.category = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.category) || undefined;
    if ((queryParams === null || queryParams === void 0 ? void 0 : queryParams.productIds) && Array.isArray(queryParams === null || queryParams === void 0 ? void 0 : queryParams.productIds)) {
        queryParams === null || queryParams === void 0 ? void 0 : queryParams.productIds.map((productId) => {
            productQuery.productIds.push(productId.toString());
        });
    }
    if ((queryParams === null || queryParams === void 0 ? void 0 : queryParams.skus) && Array.isArray(queryParams === null || queryParams === void 0 ? void 0 : queryParams.skus)) {
        queryParams === null || queryParams === void 0 ? void 0 : queryParams.skus.map((sku) => {
            productQuery.skus.push(sku.toString());
        });
    }
    const configFiltersData = [];
    configFiltersData.push(...ProductQueryFactory.mergeProductFiltersAndValues(queryParams));
    configFiltersData.push(...ProductQueryFactory.mergeCategoryFiltersAndValues(queryParams));
    let key;
    let configFilterData;
    if (configFiltersData instanceof Array) {
        for ([key, configFilterData] of Object.entries(configFiltersData)) {
            if ((configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.field) === 'categoryId') {
                productQuery.category = configFilterData.values[0];
                continue;
            }
            switch (configFilterData.type) {
                case FilterFieldTypes.NUMBER:
                    const rangeFilter = {
                        identifier: configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.field,
                        type: FilterTypes.RANGE,
                        min: +(configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.min) || undefined,
                        max: +(configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.max) || undefined,
                    };
                    filters.push(rangeFilter);
                    break;
                case FilterFieldTypes.ENUM:
                    const enumFilter = {
                        identifier: configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.field,
                        type: FilterTypes.TERM,
                        terms: configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.values.map((term) => term),
                    };
                    filters.push(enumFilter);
                    break;
                case FilterFieldTypes.BOOLEAN:
                    const booleanFilter = {
                        identifier: configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.field,
                        type: FilterTypes.BOOLEAN,
                        terms: [configFilterData === null || configFilterData === void 0 ? void 0 : configFilterData.values[0]],
                    };
                    filters.push(booleanFilter);
                    break;
                default:
                    break;
            }
        }
        productQuery.filters = filters;
    }
    if (queryParams.facets) {
        productQuery.facets = ProductQueryFactory.queryParamsToFacets(queryParams);
    }
    if (queryParams.sortAttributes) {
        const sortAttributes = {};
        let sortAttribute;
        for (sortAttribute of Object.values(queryParams.sortAttributes)) {
            const key = Object.keys(sortAttribute)[0];
            sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
        }
        productQuery.sortAttributes = sortAttributes;
    }
    productQuery.limit = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.limit) || undefined;
    productQuery.cursor = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.cursor) || undefined;
    return productQuery;
};
//# sourceMappingURL=ProductQueryFactory.js.map