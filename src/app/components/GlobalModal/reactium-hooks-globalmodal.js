/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin GlobalModal
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Hook, Enums, Component, Handle, ReactiumSyncState, cxFactory } =
        await import('@atomic-reactor/reactium-core/sdk');

    const { GlobalModal } = await import('./GlobalModal');
    Component.register('GlobalModal', GlobalModal);
})();
