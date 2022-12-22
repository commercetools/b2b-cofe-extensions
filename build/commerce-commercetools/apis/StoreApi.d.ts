import { BaseApi } from './BaseApi';
import { Store } from '../../../node_modules/@b2bdemo/types/build/store/store';
export declare class StoreApi extends BaseApi {
    create: (store: Store) => Promise<any>;
    get: (key: string) => Promise<any>;
    query: (where?: string) => Promise<any>;
}
