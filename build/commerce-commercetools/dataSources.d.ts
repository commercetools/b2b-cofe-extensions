import { DataSourceConfiguration, DataSourceContext } from '@frontastic/extension-types';
declare const _default: {
    'frontastic/categories': (config: DataSourceConfiguration, context: DataSourceContext) => Promise<{
        dataSourcePayload: {
            categories: import("../types/product/Category").Category[];
        };
    }>;
    'frontastic/product-list': (config: DataSourceConfiguration, context: DataSourceContext) => Promise<{
        dataSourcePayload: import("../types/product/Result").Result;
    }>;
    'frontastic/similar-products': (config: DataSourceConfiguration, context: DataSourceContext) => Promise<{
        dataSourcePayload: import("../types/product/Result").Result;
    }>;
    'frontastic/product': (config: DataSourceConfiguration, context: DataSourceContext) => Promise<{
        dataSourcePayload: {
            product: import("../types/product/Product").Product;
        };
    }>;
    'b2b/organization': (config: DataSourceConfiguration, context: DataSourceContext) => {
        dataSourcePayload: {
            organization: any;
        };
    };
    'b2b/organization-tree': (config: DataSourceConfiguration, context: DataSourceContext) => Promise<{
        dataSourcePayload: {
            tree: import("../types/business-unit/BusinessUnit").BusinessUnit[];
        };
    }>;
};
export default _default;
