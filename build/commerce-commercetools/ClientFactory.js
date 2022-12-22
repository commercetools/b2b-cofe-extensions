"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFactory = void 0;
const sdk_client_v2_1 = require("@commercetools/sdk-client-v2");
const node_fetch_1 = require("node-fetch");
class ClientFactory {
}
exports.ClientFactory = ClientFactory;
ClientFactory.factor = (clientConfig, environment) => {
    const authMiddlewareOptions = {
        host: clientConfig.authUrl,
        projectKey: clientConfig.projectKey,
        credentials: {
            clientId: clientConfig.clientId,
            clientSecret: clientConfig.clientSecret,
        },
        fetch: node_fetch_1.default,
    };
    const httpMiddlewareOptions = {
        host: clientConfig.hostUrl,
        fetch: node_fetch_1.default,
    };
    let clientBuilder = new sdk_client_v2_1.ClientBuilder()
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions);
    if (environment !== undefined && environment !== 'prod' && environment !== 'production') {
        clientBuilder = clientBuilder.withLoggerMiddleware();
    }
    return clientBuilder.build();
};
//# sourceMappingURL=ClientFactory.js.map