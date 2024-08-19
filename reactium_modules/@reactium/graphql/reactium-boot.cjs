const proxy = require('http-proxy-middleware');

const { Enums } = ReactiumBoot;

const graphqlProxyPath = process.env.GRAPHQL_PROXY_URL || '/graphql';
const playgroundURL = process.env.GRAPHQL_PLAYGROUND_URL || '/playground';
const playgroundEnabled =
    process.env.GRAPHQL_PLAYGROUND_ENABLED === 'on' ||
    process.env.NODE_ENV === 'development';
const proxyEnabled = process.env.GRAPHQL_PROXY_ENABLED !== 'off';
const graphqlAPI =
    process.env.GRAPHQL_URL || `http://localhost:4000${graphqlProxyPath}`;
const logLevel = process.env.DEBUG === 'on' ? 'debug' : 'error';

BOOT('GraphQL Module for Reactium...');
BOOT('GraphQL API:', graphqlAPI);
DEBUG(
    'Set GraphQL API URL with GRAPHQL_URL environment variable (defaults to http://localhost:4000/graphql)',
);

BOOT('GraphQL Proxy:', proxyEnabled ? graphqlProxyPath : 'disabled');
DEBUG(
    'Set GraphQL Proxy URL with GRAPHQL_PROXY_URL environment variable. Disable with GRAPHQL_PROXY_ENABLED=off (defaults to /graphql)',
);

BOOT('GraphQL Playground:', playgroundEnabled ? playgroundURL : 'disabled');
DEBUG(
    'Set GraphQL Playground URL with GRAPHQL_PLAYGROUND_URL environment variable. Disable with GRAPHQL_PLAYGROUND=off (default in production)',
);

ReactiumBoot.Hook.registerSync(
    'Server.AppGlobals',
    (req, AppGlobals) => {
        AppGlobals.register('playgroundEnabled', {
            name: 'playgroundEnabled',
            value: playgroundEnabled,
        });

        AppGlobals.register('graphqlAPI', {
            name: 'graphqlAPI',
            value: proxyEnabled ? graphqlProxyPath : graphqlAPI,
            server: graphqlAPI,
        });
    },
    Enums.priority.highest,
    'REACTIUM-CORE-SDK-GRAPHQL-GLOBALS',
);

if (graphqlAPI && proxyEnabled && graphqlProxyPath) {
    ReactiumBoot.Server.Middleware.register('graphql', {
        name: 'graphql',
        use: proxy(graphqlProxyPath, {
            target: graphqlAPI,
            changeOrigin: true,
            pathRewrite: {
                [`^${graphqlProxyPath}`]: '',
            },
            logLevel,
            ws: true,
        }),
        order: Enums.priority.highest,
    });
}

if (playgroundEnabled && graphqlAPI) {
    const express = require('express');
    const playgroundMiddleware =
        require('graphql-playground-middleware-express').default;
    const Router = express.Router();
    Router.get(
        playgroundURL,
        playgroundMiddleware({ endpoint: graphqlProxyPath }),
    );

    ReactiumBoot.Server.Middleware.register('graphql-playground', {
        name: 'graphql-playground',
        use: Router,
        order: Enums.priority.highest,
    });
}
