/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin ApolloTest
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Hook, Enums, Component } = await import('@atomic-reactor/reactium-core/sdk');

    Hook.register('plugin-init', async () => {
        const { ApolloTest } = await import('./ApolloTest');        
        Component.register('ApolloTest', ApolloTest);
    }, Enums.priority.normal, 'plugin-init-ApolloTest');
})();
