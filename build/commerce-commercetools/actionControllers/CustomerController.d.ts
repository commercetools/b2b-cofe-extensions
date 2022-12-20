import { ActionContext, Request, Response } from '@frontastic/extension-types';
declare type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;
export declare const getById: ActionHook;
export {};
