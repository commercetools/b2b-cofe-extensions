import { BaseApi } from './BaseApi';
import { Store } from '@Types/store/store';
export declare class StoreApi extends BaseApi {
    create: (store: Store) => Promise<any>;
    get: (key: string) => Promise<any>;
    query: (where?: string) => Promise<any>;
}
