import { Context, Request } from '@frontastic/extension-types';
import { Result } from '@Types/product/Result';
export declare class CategoryRouter {
    static identifyPreviewFrom(request: Request): boolean;
    static identifyFrom(request: Request): boolean;
    static loadFor: (request: Request, frontasticContext: Context) => Promise<Result>;
    static loadPreviewFor: (request: Request, frontasticContext: Context) => Promise<Result>;
}
