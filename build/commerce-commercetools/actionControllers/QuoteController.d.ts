import { ActionContext, Request, Response } from '@frontastic/extension-types';
declare type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;
export interface QuoteRequestBody {
    comment: string;
}
export declare const createQuoteRequest: ActionHook;
export declare const getMyQuoteRequests: ActionHook;
export declare const getMyQuotesOverview: ActionHook;
export declare const getBusinessUnitQuotesOverview: ActionHook;
export declare const updateQuoteState: ActionHook;
export {};
