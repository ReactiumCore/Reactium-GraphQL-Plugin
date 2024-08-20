/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin GlobalModal
 * -----------------------------------------------------------------------------
 */
(async () => {
    const { Component, ReactiumSyncState, Handle, cxFactory } = await import(
        '@atomic-reactor/reactium-core/sdk'
    );
    const { GlobalModal } = await import('./GlobalModal');

    Component.register('GlobalModal', GlobalModal);

    Handle.register('Modal', {
        current: new ReactiumSyncState({
            show: false,
            cx: cxFactory('modal'),
            className: '',
            dialogProps: {},
            content: null,
        }),
    });
})();
