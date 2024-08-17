/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin AppParent
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Hook, Enums, Component } = await import('@atomic-reactor/reactium-core/sdk');

    Hook.register('plugin-init', async () => {
        const { AppParent } = await import('./AppParent');        
        Component.register('AppParent', AppParent);
    }, Enums.priority.normal, 'plugin-init-AppParent');
})();
