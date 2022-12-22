import { Result } from '@Types/product/Result';
import { ProductQuery } from '@Types/query/ProductQuery';
import { Product } from '@Types/product/Product';
import { BaseApi } from './BaseApi';
import { FilterField } from '@Types/product/FilterField';
import { CategoryQuery } from '@Types/query/CategoryQuery';
import { Category } from '@Types/product/Category';
export declare class ProductApi extends BaseApi {
    protected getOffsetFromCursor: (cursor: string) => number;
    query: (productQuery: ProductQuery, additionalQueryArgs?: object, additionalFacets?: object[]) => Promise<Result>;
    getProduct: (productQuery: ProductQuery, additionalQueryArgs?: object) => Promise<Product>;
    getSearchableAttributes: () => Promise<FilterField[]>;
    getAttributeGroup: (key: string) => Promise<string[]>;
    getNavigationCategories: () => Promise<Category[]>;
    queryCategories: (categoryQuery: CategoryQuery) => Promise<Result>;
}
