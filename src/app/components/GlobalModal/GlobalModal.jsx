import Modal from 'react-bootstrap/Modal';
import {
    cxFactory,
    useRegisterSyncHandle,
} from '@atomic-reactor/reactium-core/sdk';
import cn from 'classnames';

/**
 * -----------------------------------------------------------------------------
 * Component: GlobalModal
 * -----------------------------------------------------------------------------
 */
export const GlobalModal = () => {
    const handle = useRegisterSyncHandle('Modal', {
        show: false,
        cx: cxFactory('modal'),
        className: '',
        dialogProps: {},
        header: 'Modal Header',
        headerProps: { closeButton: true },
        body: 'Modal Body',
        bodyProps: {},
        footer: 'Modal Footer',
        footerProps: {},
    });

    handle.extend('open', () => handle.set('show', true));
    handle.extend('close', () => handle.set('show', false));
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
                    <Modal.Header {...handle.get('headerProps', {})}>
                        {handle.get('header', null)}
                    </Modal.Header>
                    <Modal.Body {...handle.get('bodyProps', {})}>
                        {handle.get('body', null)}
                    </Modal.Body>
                    <Modal.Footer {...handle.get('footerProps', {})}>
                        {handle.get('footer', null)}
                    </Modal.Footer>
                </Modal>
            </section>
        )
    );
};
