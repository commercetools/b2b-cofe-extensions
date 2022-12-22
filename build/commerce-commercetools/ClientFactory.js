import { ClientBuilder } from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';
export class ClientFactory {
}
ClientFactory.factor = (clientConfig, environment) => {
    const authMiddlewareOptions = {
        host: clientConfig.authUrl,
        projectKey: clientConfig.projectKey,
        credentials: {
            clientId: clientConfig.clientId,
            clientSecret: clientConfig.clientSecret,
        },
        fetch,
    };
    const httpMiddlewareOptions = {
        host: clientConfig.hostUrl,
        fetch,
    };
    let clientBuilder = new ClientBuilder()
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions);
    if (environment !== undefined && environment !== 'prod' && environment !== 'production') {
        clientBuilder = clientBuilder.withLoggerMiddleware();
    }
    return clientBuilder.build();
};
//# sourceMappingURL=ClientFactory.js.map