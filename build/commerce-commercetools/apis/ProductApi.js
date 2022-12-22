var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProductMapper } from '../mappers/ProductMapper';
import { BaseApi } from './BaseApi';
import { FilterFieldTypes } from '@Types/product/FilterField';
import { FilterTypes } from '@Types/query/Filter';
export class ProductApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.getOffsetFromCursor = (cursor) => {
            if (cursor === undefined) {
                return undefined;
            }
            const offsetMach = cursor.match(/(?<=offset:).+/);
            return offsetMach !== null ? +Object.values(offsetMach)[0] : undefined;
        };
        this.query = (productQuery, additionalQueryArgs, additionalFacets = []) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const limit = +productQuery.limit || 24;
                const filterQuery = [];
                const filterFacets = [];
                const sortAttributes = [];
                const facetDefinitions = [
                    ...ProductMapper.commercetoolsProductTypesToFacetDefinitions(yield this.getProductTypes(), locale),
                    ...additionalFacets,
                    {
                        attributeId: 'variants.scopedPrice.value',
                        attributeType: 'money',
                    },
                    {
                        attributeId: 'variants.price',
                        attributeType: 'money',
                    },
                ];
                const queryArgFacets = ProductMapper.facetDefinitionsToCommercetoolsQueryArgFacets(facetDefinitions, locale);
                if (productQuery.productIds !== undefined && productQuery.productIds.length !== 0) {
                    filterQuery.push(`id:"${productQuery.productIds.join('","')}"`);
                }
                if (productQuery.skus !== undefined && productQuery.skus.length !== 0) {
                    filterQuery.push(`variants.sku:"${productQuery.skus.join('","')}"`);
                }
                if (productQuery.category !== undefined && productQuery.category !== '') {
                    filterQuery.push(`categories.id:subtree("${productQuery.category}")`);
                }
                if (productQuery.filters !== undefined) {
                    productQuery.filters.forEach((filter) => {
                        var _a, _b, _c;
                        switch (filter.type) {
                            case FilterTypes.TERM:
                                filterQuery.push(`${filter.identifier}.key:"${filter.terms.join('","')}"`);
                                break;
                            case FilterTypes.BOOLEAN:
                                filterQuery.push(`${filter.identifier}:${((_a = filter.terms[0]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) === 'true'}`);
                                break;
                            case FilterTypes.RANGE:
                                if (filter.identifier === 'price') {
                                    filterQuery.push(`variants.scopedPrice.value.centAmount:range (${(_b = filter.min) !== null && _b !== void 0 ? _b : '*'} to ${(_c = filter.max) !== null && _c !== void 0 ? _c : '*'})`);
                                }
                                break;
                        }
                    });
                }
                if (productQuery.facets !== undefined) {
                    filterFacets.push(...ProductMapper.facetDefinitionsToFilterFacets(productQuery.facets, facetDefinitions, locale));
                }
                if (productQuery.sortAttributes !== undefined) {
                    Object.keys(productQuery.sortAttributes).map((field, directionIndex) => {
                        sortAttributes.push(`${field} ${Object.values(productQuery.sortAttributes)[directionIndex]}`);
                    });
                }
                else {
                    sortAttributes.push(`variants.attributes.salesRank asc`);
                }
                const methodArgs = {
                    queryArgs: Object.assign({ sort: sortAttributes, limit: limit, offset: this.getOffsetFromCursor(productQuery.cursor), priceCurrency: locale.currency, priceCountry: locale.country, facet: queryArgFacets.length > 0 ? queryArgFacets : undefined, filter: filterFacets.length > 0 ? filterFacets : undefined, expand: 'categories[*]', 'filter.facets': filterFacets.length > 0 ? filterFacets : undefined, 'filter.query': filterQuery.length > 0 ? filterQuery : undefined, [`text.${locale.language}`]: productQuery.query }, additionalQueryArgs),
                };
                return yield this.getApiForProject()
                    .productProjections()
                    .search()
                    .get(methodArgs)
                    .execute()
                    .then((response) => {
                    const items = response.body.results.map((product) => ProductMapper.commercetoolsProductProjectionToProduct(product, locale));
                    const result = {
                        total: response.body.total,
                        items: items,
                        count: response.body.count,
                        facets: ProductMapper.commercetoolsFacetResultsToFacets(response.body.facets, productQuery, locale),
                        previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
                        nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
                        query: productQuery,
                    };
                    return result;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (error) {
                throw new Error(`query failed. ${error}`);
            }
        });
        this.getProduct = (productQuery, additionalQueryArgs) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.query(productQuery, additionalQueryArgs);
                return result.items.shift();
            }
            catch (error) {
                throw new Error(`getProduct failed. ${error}`);
            }
        });
        this.getSearchableAttributes = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const response = yield this.getApiForProject().productTypes().get().execute();
                const filterFields = ProductMapper.commercetoolsProductTypesToFilterFields(response.body.results, locale);
                filterFields.push({
                    field: 'categoryId',
                    type: FilterFieldTypes.ENUM,
                    label: 'Category ID',
                    values: yield this.queryCategories({ limit: 250 }).then((result) => {
                        return result.items.map((item) => {
                            return {
                                value: item.categoryId,
                                name: item.name,
                            };
                        });
                    }),
                });
                return filterFields;
            }
            catch (error) {
                throw new Error(`getSearchableAttributes failed. ${error}`);
            }
        });
        this.getAttributeGroup = (key) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = yield this.getApiForProject().attributeGroups().withKey({ key }).get().execute();
                return ProductMapper.commercetoolsAttributeGroupToString(body);
            }
            catch (error) {
                throw new Error(`get attributeGroup failed. ${error}`);
            }
        });
        this.getNavigationCategories = () => __awaiter(this, void 0, void 0, function* () {
            const { items } = yield this.queryCategories({ limit: 500 });
            const categories = items.filter((item) => { var _a; return !((_a = item.ancestors) === null || _a === void 0 ? void 0 : _a.length); });
            const subCategories = items
                .filter((item) => { var _a; return !!((_a = item.ancestors) === null || _a === void 0 ? void 0 : _a.length); })
                .sort((a, b) => b.depth - a.depth);
            while (subCategories.length) {
                const [currentSubCategory] = subCategories.splice(0, 1);
                const lastAncestor = currentSubCategory.ancestors[currentSubCategory.ancestors.length - 1];
                const subCategoryIdx = subCategories.findIndex((item) => item.categoryId === lastAncestor.id);
                if (subCategoryIdx !== -1) {
                    subCategories[subCategoryIdx].children = [
                        ...(subCategories[subCategoryIdx].children || []),
                        currentSubCategory,
                    ];
                }
                else {
                    const categoryIdx = categories.findIndex((item) => item.categoryId === lastAncestor.id);
                    if (categoryIdx !== -1) {
                        categories[categoryIdx].children = [...(categories[categoryIdx].children || []), currentSubCategory];
                    }
                }
            }
            return categories;
        });
        this.queryCategories = (categoryQuery) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                const limit = +categoryQuery.limit || 24;
                const where = [];
                if (categoryQuery.slug) {
                    where.push(`slug(${locale.language}="${categoryQuery.slug}")`);
                }
                if (categoryQuery.parentId) {
                    where.push(`parent(id="${categoryQuery.parentId}")`);
                }
                const methodArgs = {
                    queryArgs: {
                        limit: limit,
                        offset: this.getOffsetFromCursor(categoryQuery.cursor),
                        where: where.length > 0 ? where : undefined,
                    },
                };
                return yield this.getApiForProject()
                    .categories()
                    .get(methodArgs)
                    .execute()
                    .then((response) => {
                    const items = response.body.results.map((category) => ProductMapper.commercetoolsCategoryToCategory(category, locale));
                    const result = {
                        total: response.body.total,
                        items: items,
                        count: response.body.count,
                        previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
                        nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
                        query: categoryQuery,
                    };
                    return result;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (error) {
                throw new Error(`queryCategories failed. ${error}`);
            }
        });
    }
}
//# sourceMappingURL=ProductApi.js.map