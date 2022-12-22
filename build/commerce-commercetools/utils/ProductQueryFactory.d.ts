import { DataSourceConfiguration, Request } from '@frontastic/extension-types';
import { ProductQuery } from '@Types/query/ProductQuery';
export declare class ProductQueryFactory {
    static queryFromParams: (request: Request, config?: DataSourceConfiguration) => ProductQuery;
    private static queryParamsToFacets;
    private static mergeProductFiltersAndValues;
    private static mergeCategoryFiltersAndValues;
}
