"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
const ProductRouter_1 = require("../utils/ProductRouter");
const FilterField_1 = require("../../../node_modules/@b2bdemo/types/build/product/FilterField");
const Facet_1 = require("../../../node_modules/@b2bdemo/types/build/result/Facet");
const Filter_1 = require("../../../node_modules/@b2bdemo/types/build/query/Filter");
const TypeMap = new Map([
    ['boolean', FilterField_1.FilterFieldTypes.BOOLEAN],
    ['enum', FilterField_1.FilterFieldTypes.ENUM],
    ['text', FilterField_1.FilterFieldTypes.TEXT],
    ['number', FilterField_1.FilterFieldTypes.NUMBER],
    ['lenum', FilterField_1.FilterFieldTypes.ENUM],
    ['ltext', FilterField_1.FilterFieldTypes.TEXT],
]);
class ProductMapper {
    static extractAttributeValue(commercetoolsAttributeValue, locale) {
        if (commercetoolsAttributeValue['key'] !== undefined && commercetoolsAttributeValue['label'] !== undefined) {
            return {
                key: commercetoolsAttributeValue['key'],
                label: ProductMapper.extractAttributeValue(commercetoolsAttributeValue['label'], locale),
            };
        }
        if (commercetoolsAttributeValue instanceof Array) {
            return commercetoolsAttributeValue.map((value) => ProductMapper.extractAttributeValue(value, locale));
        }
        return commercetoolsAttributeValue[locale.language] || commercetoolsAttributeValue;
    }
    static extractPriceAndDiscounts(commercetoolsVariant, locale) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        let price = undefined;
        let discountedPrice = undefined;
        let discounts = undefined;
        if (commercetoolsVariant === null || commercetoolsVariant === void 0 ? void 0 : commercetoolsVariant.scopedPrice) {
            price = ProductMapper.commercetoolsMoneyToMoney((_a = commercetoolsVariant.scopedPrice) === null || _a === void 0 ? void 0 : _a.value);
            discountedPrice = ProductMapper.commercetoolsMoneyToMoney((_c = (_b = commercetoolsVariant.scopedPrice) === null || _b === void 0 ? void 0 : _b.discounted) === null || _c === void 0 ? void 0 : _c.value);
            discounts = [(_g = (_f = (_e = (_d = commercetoolsVariant.scopedPrice) === null || _d === void 0 ? void 0 : _d.discounted) === null || _e === void 0 ? void 0 : _e.discount) === null || _f === void 0 ? void 0 : _f.obj) === null || _g === void 0 ? void 0 : _g.description[locale.language]];
            return { price, discountedPrice, discounts };
        }
        if (commercetoolsVariant === null || commercetoolsVariant === void 0 ? void 0 : commercetoolsVariant.price) {
            price = ProductMapper.commercetoolsMoneyToMoney((_h = commercetoolsVariant.price) === null || _h === void 0 ? void 0 : _h.value);
            discountedPrice = ProductMapper.commercetoolsMoneyToMoney((_k = (_j = commercetoolsVariant.price) === null || _j === void 0 ? void 0 : _j.discounted) === null || _k === void 0 ? void 0 : _k.value);
            discounts = [(_p = (_o = (_m = (_l = commercetoolsVariant.price) === null || _l === void 0 ? void 0 : _l.discounted) === null || _m === void 0 ? void 0 : _m.discount) === null || _o === void 0 ? void 0 : _o.obj) === null || _p === void 0 ? void 0 : _p.description[locale.language]];
            return { price, discountedPrice, discounts };
        }
        return { price, discountedPrice, discounts };
    }
    static commercetoolsMoneyToMoney(commercetoolsMoney) {
        if (commercetoolsMoney === undefined) {
            return undefined;
        }
        return {
            fractionDigits: commercetoolsMoney.hasOwnProperty('fractionDigits') &&
                commercetoolsMoney.fractionDigits !== undefined
                ? commercetoolsMoney.fractionDigits
                : 2,
            centAmount: commercetoolsMoney.centAmount,
            currencyCode: commercetoolsMoney.currencyCode,
        };
    }
    static commercetoolsProductTypesToFilterFields(commercetoolsProductTypes, locale) {
        const filterFields = [];
        commercetoolsProductTypes === null || commercetoolsProductTypes === void 0 ? void 0 : commercetoolsProductTypes.forEach((productType) => {
            var _a;
            (_a = productType.attributes) === null || _a === void 0 ? void 0 : _a.forEach((attribute) => {
                if (!attribute.isSearchable) {
                    return;
                }
                filterFields.push(ProductMapper.commercetoolsAttributeDefinitionToFilterField(attribute, locale));
            });
        });
        return filterFields;
    }
    static commercetoolsAttributeDefinitionToFilterField(commercetoolsAttributeDefinition, locale) {
        var _a, _b, _c, _d, _e, _f;
        let commercetoolsAttributeType = commercetoolsAttributeDefinition.type.name;
        let commercetoolsAttributeValues = ((_a = commercetoolsAttributeDefinition.type) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('values'))
            ? commercetoolsAttributeDefinition.type.values
            : [];
        if (commercetoolsAttributeType === 'set' && ((_b = commercetoolsAttributeDefinition.type) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('elementType'))) {
            const elementType = commercetoolsAttributeDefinition.type.elementType;
            commercetoolsAttributeType = elementType.name;
            commercetoolsAttributeValues = (elementType === null || elementType === void 0 ? void 0 : elementType.hasOwnProperty('values'))
                ? elementType.values
                : [];
        }
        const filterFieldValues = [];
        for (const value of commercetoolsAttributeValues) {
            filterFieldValues.push({
                value: value.key,
                name: (_d = (_c = value.label) === null || _c === void 0 ? void 0 : _c[locale.language]) !== null && _d !== void 0 ? _d : value.label,
            });
        }
        return {
            field: `variants.attributes.${commercetoolsAttributeDefinition.name}`,
            type: TypeMap.has(commercetoolsAttributeType)
                ? TypeMap.get(commercetoolsAttributeType)
                : commercetoolsAttributeType,
            label: (_f = (_e = commercetoolsAttributeDefinition.label) === null || _e === void 0 ? void 0 : _e[locale.language]) !== null && _f !== void 0 ? _f : commercetoolsAttributeDefinition.name,
            values: filterFieldValues.length > 0 ? filterFieldValues : undefined,
        };
    }
    static commercetoolsProductTypesToFacetDefinitions(commercetoolsProductTypes, locale) {
        const facetDefinitionsIndex = {};
        const facetDefinitions = [];
        commercetoolsProductTypes === null || commercetoolsProductTypes === void 0 ? void 0 : commercetoolsProductTypes.forEach((productType) => {
            var _a;
            (_a = productType.attributes) === null || _a === void 0 ? void 0 : _a.forEach((attribute) => {
                if (!attribute.isSearchable) {
                    return;
                }
                const facetDefinition = {
                    attributeType: attribute.type.name,
                    attributeId: `variants.attributes.${attribute.name}`,
                };
                facetDefinitionsIndex[facetDefinition.attributeId] = facetDefinition;
            });
        });
        for (const [attributeId, facetDefinition] of Object.entries(facetDefinitionsIndex)) {
            facetDefinitions.push(facetDefinition);
        }
        return facetDefinitions;
    }
    static facetDefinitionsToCommercetoolsQueryArgFacets(facetDefinitions, locale) {
        const queryArgFacets = [];
        facetDefinitions === null || facetDefinitions === void 0 ? void 0 : facetDefinitions.forEach((facetDefinition) => {
            let facet;
            switch (facetDefinition.attributeType) {
                case 'money':
                    facet = `${facetDefinition.attributeId}.centAmount:range (0 to *)`;
                    break;
                case 'enum':
                    facet = `${facetDefinition.attributeId}.label`;
                    break;
                case 'lenum':
                    facet = `${facetDefinition.attributeId}.label.${locale.language}`;
                    break;
                case 'ltext':
                    facet = `${facetDefinition.attributeId}.${locale.language}`;
                    break;
                case 'number':
                case 'boolean':
                case 'text':
                case 'reference':
                default:
                    facet = facetDefinition.attributeId;
                    break;
            }
            queryArgFacets.push(`${facet} as ${facetDefinition.attributeId}`);
        });
        return queryArgFacets;
    }
    static facetDefinitionsToFilterFacets(queryFacets, facetDefinitions, locale) {
        const filterFacets = [];
        const typeLookup = {};
        if (facetDefinitions.length === 0) {
            return filterFacets;
        }
        facetDefinitions.forEach((facetDefinition) => {
            typeLookup[facetDefinition.attributeId] = facetDefinition.attributeType;
        });
        queryFacets.forEach((queryFacet) => {
            if (!(typeLookup === null || typeLookup === void 0 ? void 0 : typeLookup.hasOwnProperty(queryFacet.identifier))) {
                return;
            }
            switch (typeLookup[queryFacet.identifier]) {
                case 'money':
                    filterFacets.push(`${queryFacet.identifier}.centAmount:range (${queryFacet.min} to ${queryFacet.max})`);
                    break;
                case 'enum':
                    filterFacets.push(`${queryFacet.identifier}.label:"${queryFacet.terms.join('","')}"`);
                    break;
                case 'lenum':
                    filterFacets.push(`${queryFacet.identifier}.label.${locale.language}:"${queryFacet.terms.join('","')}"`);
                    break;
                case 'ltext':
                    filterFacets.push(`${queryFacet.identifier}.${locale.language}:"${queryFacet.terms.join('","')}"`);
                    break;
                case 'number':
                case 'boolean':
                case 'text':
                case 'reference':
                default:
                    if (queryFacet.type === Filter_1.FilterTypes.TERM || queryFacet.type === Filter_1.FilterTypes.BOOLEAN) {
                        filterFacets.push(`${queryFacet.identifier}:"${queryFacet.terms.join('","')}"`);
                    }
                    else {
                        filterFacets.push(`${queryFacet.identifier}:range (${queryFacet.min} to ${queryFacet.max})`);
                    }
                    break;
            }
        });
        return filterFacets;
    }
    static commercetoolsFacetResultsToFacets(commercetoolsFacetResults, productQuery, locale) {
        const facets = [];
        for (const [facetKey, facetResult] of Object.entries(commercetoolsFacetResults)) {
            const facetQuery = this.findFacetQuery(productQuery, facetKey);
            switch (facetResult.type) {
                case 'range':
                    facets.push(ProductMapper.commercetoolsRangeFacetResultToRangeFacet(facetKey, facetResult, facetQuery));
                    break;
                case 'terms':
                    if (facetResult.dataType === 'number') {
                        facets.push(ProductMapper.commercetoolsTermNumberFacetResultToRangeFacet(facetKey, facetResult, facetQuery));
                        break;
                    }
                    facets.push(ProductMapper.commercetoolsTermFacetResultToTermFacet(facetKey, facetResult, facetQuery));
                    break;
                case 'filter':
                default:
                    break;
            }
        }
        return facets;
    }
    static commercetoolsRangeFacetResultToRangeFacet(facetKey, facetResult, facetQuery) {
        const rangeFacet = {
            type: Facet_1.FacetTypes.RANGE,
            identifier: facetKey,
            label: facetKey,
            key: facetKey,
            min: facetResult.ranges[0].min,
            max: facetResult.ranges[0].max,
            selected: facetQuery !== undefined,
            minSelected: facetQuery ? facetQuery.min : undefined,
            maxSelected: facetQuery ? facetQuery.max : undefined,
        };
        return rangeFacet;
    }
    static commercetoolsTermFacetResultToTermFacet(facetKey, facetResult, facetQuery) {
        const termFacet = {
            type: Facet_1.FacetTypes.TERM,
            identifier: facetKey,
            label: facetKey,
            key: facetKey,
            selected: facetQuery !== undefined,
            terms: facetResult.terms.map((facetResultTerm) => {
                const term = {
                    identifier: facetResultTerm.term.toString(),
                    label: facetResultTerm.term.toString(),
                    count: facetResultTerm.count,
                    key: facetResultTerm.term.toString(),
                    selected: facetQuery !== undefined && facetQuery.terms.includes(facetResultTerm.term.toString()),
                };
                return term;
            }),
        };
        return termFacet;
    }
    static commercetoolsTermNumberFacetResultToRangeFacet(facetKey, facetResult, facetQuery) {
        var _a, _b;
        const rangeFacet = {
            type: Facet_1.FacetTypes.RANGE,
            identifier: facetKey,
            label: facetKey,
            key: facetKey,
            count: facetResult.total,
            min: (_a = Math.min(...facetResult.terms.map((facetResultTerm) => facetResultTerm.term))) !== null && _a !== void 0 ? _a : Number.MIN_SAFE_INTEGER,
            max: (_b = Math.max(...facetResult.terms.map((facetResultTerm) => facetResultTerm.term))) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER,
        };
        if (facetQuery) {
            rangeFacet.selected = true;
            rangeFacet.minSelected = facetQuery.min;
            rangeFacet.maxSelected = facetQuery.max;
        }
        return rangeFacet;
    }
    static commercetoolsAttributeGroupToString(body) {
        return body.attributes.map((attribute) => attribute.key);
    }
    static calculatePreviousCursor(offset, count) {
        return offset - count >= 0 ? `offset:${offset - count}` : undefined;
    }
    static calculateNextCursor(offset, count, total) {
        return offset + count < total ? `offset:${offset + count}` : undefined;
    }
    static findFacetQuery(productQuery, facetKey) {
        if (productQuery.facets !== undefined) {
            for (const facet of productQuery.facets) {
                if (facet.identifier === facetKey) {
                    return facet;
                }
            }
        }
        return undefined;
    }
}
exports.ProductMapper = ProductMapper;
ProductMapper.commercetoolsProductProjectionToProduct = (commercetoolsProduct, locale) => {
    var _a, _b, _c, _d;
    const product = {
        productId: commercetoolsProduct.id,
        version: (_a = commercetoolsProduct === null || commercetoolsProduct === void 0 ? void 0 : commercetoolsProduct.version) === null || _a === void 0 ? void 0 : _a.toString(),
        name: (_b = commercetoolsProduct === null || commercetoolsProduct === void 0 ? void 0 : commercetoolsProduct.name) === null || _b === void 0 ? void 0 : _b[locale.language],
        slug: (_c = commercetoolsProduct === null || commercetoolsProduct === void 0 ? void 0 : commercetoolsProduct.slug) === null || _c === void 0 ? void 0 : _c[locale.language],
        description: (_d = commercetoolsProduct === null || commercetoolsProduct === void 0 ? void 0 : commercetoolsProduct.description) === null || _d === void 0 ? void 0 : _d[locale.language],
        categories: ProductMapper.commercetoolsCategoryReferencesToCategories(commercetoolsProduct.categories, locale),
        variants: ProductMapper.commercetoolsProductProjectionToVariants(commercetoolsProduct, locale),
    };
    product._url = ProductRouter_1.ProductRouter.generateUrlFor(product);
    return product;
};
ProductMapper.commercetoolsProductProjectionToVariants = (commercetoolsProduct, locale) => {
    const variants = [];
    if (commercetoolsProduct === null || commercetoolsProduct === void 0 ? void 0 : commercetoolsProduct.masterVariant) {
        variants.push(ProductMapper.commercetoolsProductVariantToVariant(commercetoolsProduct.masterVariant, locale));
    }
    for (let i = 0; i < commercetoolsProduct.variants.length; i++) {
        variants.push(ProductMapper.commercetoolsProductVariantToVariant(commercetoolsProduct.variants[i], locale));
    }
    return variants;
};
ProductMapper.commercetoolsProductVariantToVariant = (commercetoolsVariant, locale, productPrice) => {
    var _a, _b, _c;
    const attributes = ProductMapper.commercetoolsAttributesToAttributes(commercetoolsVariant.attributes, locale);
    const { price, discountedPrice, discounts } = ProductMapper.extractPriceAndDiscounts(commercetoolsVariant, locale);
    return {
        id: (_a = commercetoolsVariant.id) === null || _a === void 0 ? void 0 : _a.toString(),
        sku: (_b = commercetoolsVariant.sku) === null || _b === void 0 ? void 0 : _b.toString(),
        images: [
            ...commercetoolsVariant.assets.map((asset) => { var _a; return (_a = asset.sources) === null || _a === void 0 ? void 0 : _a[0].uri; }),
            ...commercetoolsVariant.images.map((image) => image.url),
        ],
        groupId: (attributes === null || attributes === void 0 ? void 0 : attributes.baseId) || undefined,
        attributes: attributes,
        price: price,
        discountedPrice: discountedPrice,
        discounts: discounts,
        availability: ProductMapper.getPriceChannelAvailability(commercetoolsVariant, productPrice),
        isOnStock: ((_c = commercetoolsVariant.availability) === null || _c === void 0 ? void 0 : _c.isOnStock) || undefined,
    };
};
ProductMapper.getPriceChannelAvailability = (variant, productPrice) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let channelId = '';
    if (productPrice) {
        channelId = (_a = productPrice.channel) === null || _a === void 0 ? void 0 : _a.id;
    }
    else {
        channelId = ((_c = (_b = variant.scopedPrice) === null || _b === void 0 ? void 0 : _b.channel) === null || _c === void 0 ? void 0 : _c.id) || ((_e = (_d = variant.price) === null || _d === void 0 ? void 0 : _d.channel) === null || _e === void 0 ? void 0 : _e.id);
    }
    if (!channelId) {
        return variant.availability;
    }
    if (!((_g = (_f = variant.availability) === null || _f === void 0 ? void 0 : _f.channels) === null || _g === void 0 ? void 0 : _g[channelId])) {
        return variant.availability;
    }
    return variant.availability.channels[channelId];
};
ProductMapper.commercetoolsAttributesToAttributes = (commercetoolsAttributes, locale) => {
    const attributes = {};
    commercetoolsAttributes === null || commercetoolsAttributes === void 0 ? void 0 : commercetoolsAttributes.forEach((commercetoolsAttribute) => {
        attributes[commercetoolsAttribute.name] = ProductMapper.extractAttributeValue(commercetoolsAttribute.value, locale);
    });
    return attributes;
};
ProductMapper.commercetoolsCategoryReferencesToCategories = (commercetoolsCategoryReferences, locale) => {
    const categories = [];
    commercetoolsCategoryReferences.forEach((commercetoolsCategory) => {
        let category = {
            categoryId: commercetoolsCategory.id,
        };
        if (commercetoolsCategory.obj) {
            category = ProductMapper.commercetoolsCategoryToCategory(commercetoolsCategory.obj, locale);
        }
        categories.push(category);
    });
    categories.sort((a, b) => b.depth - a.depth);
    return categories;
};
ProductMapper.commercetoolsCategoryToCategory = (commercetoolsCategory, locale) => {
    var _a, _b, _c, _d, _e;
    return {
        categoryId: commercetoolsCategory.id,
        ancestors: ((_a = commercetoolsCategory.ancestors) === null || _a === void 0 ? void 0 : _a.length) ? commercetoolsCategory.ancestors : undefined,
        name: (_c = (_b = commercetoolsCategory.name) === null || _b === void 0 ? void 0 : _b[locale.language]) !== null && _c !== void 0 ? _c : undefined,
        slug: (_e = (_d = commercetoolsCategory.slug) === null || _d === void 0 ? void 0 : _d[locale.language]) !== null && _e !== void 0 ? _e : undefined,
        depth: commercetoolsCategory.ancestors.length,
        path: commercetoolsCategory.ancestors.length > 0
            ? `/${commercetoolsCategory.ancestors
                .map((ancestor) => {
                return ancestor.id;
            })
                .join('/')}/${commercetoolsCategory.id}`
            : `/${commercetoolsCategory.id}`,
    };
};
//# sourceMappingURL=ProductMapper.js.map