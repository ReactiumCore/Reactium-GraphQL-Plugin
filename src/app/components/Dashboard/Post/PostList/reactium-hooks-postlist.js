/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin PostList
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Hook, Enums, Component } = await import('@atomic-reactor/reactium-core/sdk');

    Hook.register('plugin-init', async () => {
        const { PostList } = await import('./PostList');        
        Component.register('PostList', PostList);
    }, Enums.priority.normal, 'plugin-init-PostList');
})();
