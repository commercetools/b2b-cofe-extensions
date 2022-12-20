import { Request, Response } from '@frontastic/extension-types';
import { ActionContext } from '@frontastic/extension-types';
declare type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;
export declare const getProduct: ActionHook;
export declare const query: ActionHook;
export declare const getAttributeGroup: ActionHook;
export declare const queryCategories: ActionHook;
export declare const searchableAttributes: ActionHook;
export {};
