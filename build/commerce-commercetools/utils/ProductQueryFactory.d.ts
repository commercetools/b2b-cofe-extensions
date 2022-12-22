import { DataSourceConfiguration, Request } from '@frontastic/extension-types';
import { ProductQuery } from '../../../node_modules/@b2bdemo/types/build/query/ProductQuery';
export declare class ProductQueryFactory {
    static queryFromParams: (request: Request, config?: DataSourceConfiguration) => ProductQuery;
    private static queryParamsToFacets;
    private static mergeProductFiltersAndValues;
    private static mergeCategoryFiltersAndValues;
}
