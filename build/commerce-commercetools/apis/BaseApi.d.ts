import { ApiRoot, Project, ProductType } from '@commercetools/platform-sdk';
import { Context } from '@frontastic/extension-types';
import { Locale } from '../Locale';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
export declare abstract class BaseApi {
    protected apiRoot: ApiRoot;
    protected projectKey: string;
    protected locale: string;
    protected frontasticContext: Context;
    constructor(frontasticContext: Context, locale: string);
    protected getApiForProject(): ByProjectKeyRequestBuilder;
    protected getCommercetoolsLocal(): Promise<Locale>;
    protected getProductTypes(): Promise<ProductType[]>;
    protected getProject(): Promise<Project>;
}
