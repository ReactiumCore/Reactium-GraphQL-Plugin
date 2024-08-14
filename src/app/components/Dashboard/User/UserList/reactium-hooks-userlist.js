/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin UserList
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Hook, Enums, Component } = await import('@atomic-reactor/reactium-core/sdk');

    Hook.register('plugin-init', async () => {
        const { UserList } = await import('./UserList');        
        Component.register('UserList', UserList);
    }, Enums.priority.normal, 'plugin-init-UserList');
})();
