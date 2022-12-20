import { ActionContext, Request, Response } from '@frontastic/extension-types';
declare type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;
export declare const create: ActionHook;
export declare const query: ActionHook;
export declare const setMe: ActionHook;
export {};
