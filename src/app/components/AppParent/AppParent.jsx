import { useHookComponent } from '@atomic-reactor/reactium-core/sdk';
import React from 'react';

/**
 * -----------------------------------------------------------------------------
 * Component: AppParent, special top-level component
 * -----------------------------------------------------------------------------
 */
export const AppParent = ({ children }) => {
    const GlobalModal = useHookComponent('GlobalModal');
    return (
        <>
            <main>{children}</main>
            <GlobalModal />
        </>
    );
};
