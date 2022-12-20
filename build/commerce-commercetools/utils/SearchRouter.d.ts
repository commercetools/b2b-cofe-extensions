import { Context, Request } from '@frontastic/extension-types';
import { Result } from '@Types/product/Result';
export declare class SearchRouter {
    static identifyFrom(request: Request): boolean;
    static loadFor: (request: Request, frontasticContext: Context) => Promise<Result> | null;
}
