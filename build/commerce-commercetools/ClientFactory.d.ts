import { Client } from '@commercetools/sdk-client-v2';
import { ClientConfig } from './interfaces/ClientConfig';
export declare class ClientFactory {
    static factor: (clientConfig: ClientConfig, environment: string | undefined) => Client;
}
