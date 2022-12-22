import { Result } from '../../../node_modules/@b2bdemo/types/build/product/Result';
import { ProductQuery } from '../../../node_modules/@b2bdemo/types/build/query/ProductQuery';
import { Product } from '../../../node_modules/@b2bdemo/types/build/product/Product';
import { BaseApi } from './BaseApi';
import { FilterField } from '../../../node_modules/@b2bdemo/types/build/product/FilterField';
import { CategoryQuery } from '../../../node_modules/@b2bdemo/types/build/query/CategoryQuery';
import { Category } from '../../../node_modules/@b2bdemo/types/build/product/Category';
export declare class ProductApi extends BaseApi {
    protected getOffsetFromCursor: (cursor: string) => number;
    query: (productQuery: ProductQuery, additionalQueryArgs?: object, additionalFacets?: object[]) => Promise<Result>;
    getProduct: (productQuery: ProductQuery, additionalQueryArgs?: object) => Promise<Product>;
    getSearchableAttributes: () => Promise<FilterField[]>;
    getAttributeGroup: (key: string) => Promise<string[]>;
    getNavigationCategories: () => Promise<Category[]>;
    queryCategories: (categoryQuery: CategoryQuery) => Promise<Result>;
}
