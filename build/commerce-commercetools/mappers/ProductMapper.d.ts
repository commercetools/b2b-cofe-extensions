import { Attribute as CommercetoolsAttribute, AttributeDefinition as CommercetoolsAttributeDefinition, AttributeGroup, Category as CommercetoolsCategory, CategoryReference, FacetResults as CommercetoolsFacetResults, Money as CommercetoolsMoney, Price, ProductProjection as CommercetoolsProductProjection, ProductType as CommercetoolsProductType, ProductVariant as CommercetoolsProductVariant, ProductVariantAvailability, RangeFacetResult as CommercetoolsRangeFacetResult, TermFacetResult as CommercetoolsTermFacetResult, TypedMoney } from '@commercetools/platform-sdk';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import { Attributes } from '@Types/product/Attributes';
import { Category } from '@Types/product/Category';
import { Locale } from '../Locale';
import { Money } from '@Types/product/Money';
import { FilterField } from '@Types/product/FilterField';
import { Facet } from '@Types/result/Facet';
import { TermFacet } from '@Types/result/TermFacet';
import { RangeFacet as ResultRangeFacet } from '@Types/result/RangeFacet';
import { ProductQuery } from '@Types/query/ProductQuery';
import { TermFacet as QueryTermFacet } from '@Types/query/TermFacet';
import { RangeFacet as QueryRangeFacet } from '@Types/query/RangeFacet';
import { Facet as QueryFacet } from '@Types/query/Facet';
import { FacetDefinition } from '@Types/product/FacetDefinition';
export declare class ProductMapper {
    static commercetoolsProductProjectionToProduct: (commercetoolsProduct: CommercetoolsProductProjection, locale: Locale) => Product;
    static commercetoolsProductProjectionToVariants: (commercetoolsProduct: CommercetoolsProductProjection, locale: Locale) => Variant[];
    static commercetoolsProductVariantToVariant: (commercetoolsVariant: CommercetoolsProductVariant, locale: Locale, productPrice?: Price) => Variant;
    static getPriceChannelAvailability: (variant: CommercetoolsProductVariant, productPrice?: Price) => ProductVariantAvailability;
    static commercetoolsAttributesToAttributes: (commercetoolsAttributes: CommercetoolsAttribute[], locale: Locale) => Attributes;
    static commercetoolsCategoryReferencesToCategories: (commercetoolsCategoryReferences: CategoryReference[], locale: Locale) => Category[];
    static commercetoolsCategoryToCategory: (commercetoolsCategory: CommercetoolsCategory, locale: Locale) => Category;
    static extractAttributeValue(commercetoolsAttributeValue: unknown, locale: Locale): unknown;
    static extractPriceAndDiscounts(commercetoolsVariant: CommercetoolsProductVariant, locale: Locale): {
        price: Money;
        discountedPrice: Money;
        discounts: string[];
    };
    static commercetoolsMoneyToMoney(commercetoolsMoney: CommercetoolsMoney | TypedMoney): Money | undefined;
    static commercetoolsProductTypesToFilterFields(commercetoolsProductTypes: CommercetoolsProductType[], locale: Locale): FilterField[];
    static commercetoolsAttributeDefinitionToFilterField(commercetoolsAttributeDefinition: CommercetoolsAttributeDefinition, locale: Locale): FilterField;
    static commercetoolsProductTypesToFacetDefinitions(commercetoolsProductTypes: CommercetoolsProductType[], locale: Locale): FacetDefinition[];
    static facetDefinitionsToCommercetoolsQueryArgFacets(facetDefinitions: FacetDefinition[], locale: Locale): string[];
    static facetDefinitionsToFilterFacets(queryFacets: QueryFacet[], facetDefinitions: FacetDefinition[], locale: Locale): string[];
    static commercetoolsFacetResultsToFacets(commercetoolsFacetResults: CommercetoolsFacetResults, productQuery: ProductQuery, locale: Locale): Facet[];
    static commercetoolsRangeFacetResultToRangeFacet(facetKey: string, facetResult: CommercetoolsRangeFacetResult, facetQuery: QueryRangeFacet | undefined): ResultRangeFacet;
    static commercetoolsTermFacetResultToTermFacet(facetKey: string, facetResult: CommercetoolsTermFacetResult, facetQuery: QueryTermFacet | undefined): TermFacet;
    static commercetoolsTermNumberFacetResultToRangeFacet(facetKey: string, facetResult: CommercetoolsTermFacetResult, facetQuery: QueryRangeFacet | undefined): ResultRangeFacet;
    static commercetoolsAttributeGroupToString(body: AttributeGroup): string[];
    static calculatePreviousCursor(offset: number, count: number): string;
    static calculateNextCursor(offset: number, count: number, total: number): string;
    private static findFacetQuery;
}
