import Modal from 'react-bootstrap/Modal';
import { cxFactory, useSyncHandle } from '@atomic-reactor/reactium-core/sdk';
import cn from 'classnames';

/**
 * -----------------------------------------------------------------------------
 * Component: GlobalModal
 * -----------------------------------------------------------------------------
 */
export const GlobalModal = () => {
    const handle = useSyncHandle('Modal');

    handle.extend('open', () => handle.set('show', true));

    handle.extend('close', () => {
        handle.set('show', false);
        handle.set('content', null);
    });

    handle.extend('makeSuccess', (onSuccess) => (...props) => {
        onSuccess(...props);
        handle.set('show', false);
    });

    const cx = handle.get('cx');

    return (
        handle.get('show') && (
            <section
                className={cn(cx(), handle.get('className'), {
                    show: handle.get('show', false),
                })}>
                <Modal
                    show={handle.get('show', false)}
                    onHide={handle.close}
                    onEscapeKeyDown={handle.close}
                    {...handle.get('dialogProps', {})}>
                    {handle.get('content', null)}
                </Modal>
            </section>
        )
    );
};
