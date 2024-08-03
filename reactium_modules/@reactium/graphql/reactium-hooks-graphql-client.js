import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Reactium, { Hook, Enums } from 'reactium-core/sdk';

Hook.register(
    'sdk-init',
    async () => {
        console.log('graphql registration');
        try {
            const cache = new InMemoryCache();
            const config = {
                // Provide required constructor fields
                cache,
                uri: window.graphqlAPI || 'http://localhost:4000/graphql',

                // Provide some optional constructor fields
                name: 'reactium-web-client',
                version: '1.3',
                queryDeduplication: false,
                defaultOptions: {
                    watchQuery: {
                        fetchPolicy: 'cache-and-network',
                    },
                },
            };
            await Hook.run('register-apollo-client', config);

            console.log('Registering GraphQL Apollo Client');
            if (!Reactium.API)
                throw new Error(
                    '@atomic-reactor/reactium-api module is required',
                );
            Reactium.API.register('GraphQL', {
                api: new ApolloClient({
                    uri: window.graphqlAPI || 'http://localhost:4000/graphql',
                    ...config,
                }),
                config,
            });
        } catch (err) {
            console.log(err);
        }
    },
    Enums.highest,
    'REACTIUM-CORE-SDK-GRAPHQL',
);

Hook.register('app-context-provider', async () => {
    Reactium.AppContext.register('ApolloProvider', {
        provider: ApolloProvider,
        client: Reactium.GraphQL,
    });
});
