import { BaseApi } from './BaseApi';
import { Account } from '../../../node_modules/@b2bdemo/types/build/account/Account';
export declare class CustomerApi extends BaseApi {
    get: (email: string) => Promise<Account | null>;
    getCustomerById: (id: string) => Promise<Account | null>;
}
