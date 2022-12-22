import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { AccountRegisterBody } from './AccountController';
import { Store } from '../../../node_modules/@b2bdemo/types/build/store/store';
declare type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;
export interface BusinessUnitRequestBody {
    account: AccountRegisterBody;
    store?: Store;
    parentBusinessUnit?: string;
    customer: {
        accountId: string;
    };
}
export declare const getMe: ActionHook;
export declare const setMe: ActionHook;
export declare const getMyOrganization: ActionHook;
export declare const getBusinessUnitOrders: ActionHook;
export declare const create: ActionHook;
export declare const addAssociate: ActionHook;
export declare const removeAssociate: ActionHook;
export declare const updateAssociate: ActionHook;
export declare const update: ActionHook;
export declare const getByKey: ActionHook;
export declare const remove: ActionHook;
export declare const query: ActionHook;
export {};
