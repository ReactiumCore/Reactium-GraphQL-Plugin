/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin Dashboard
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Hook, Enums, Component } = await import('@atomic-reactor/reactium-core/sdk');

    Hook.register('plugin-init', async () => {
        const { Dashboard } = await import('./Dashboard');        
        Component.register('Dashboard', Dashboard);
    }, Enums.priority.normal, 'plugin-init-Dashboard');
})();
