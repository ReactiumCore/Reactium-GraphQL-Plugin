import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    useSyncState,
    useEventEffect,
} from '@atomic-reactor/reactium-core/sdk';

const Header = ({ state }) => {
    const { id, name } = state.get('user', { name: '' });
    return (
        <Modal.Header closeButton>
            <h1>{id ? `Update ${name}` : `Create ${name || 'User'}`}</h1>
        </Modal.Header>
    );
};

const Body = ({ state }) => {
    console.log('state', state.get());
    return (
        <Modal.Body>
            <Form>
                <Form.Group controlId='edit.name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Name'
                        value={state.get('user.name', '')}
                        onChange={(e) => state.set('user.name', e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='edit.email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Email'
                        value={state.get('user.email', '')}
                        onChange={(e) =>
                            state.set('user.email', e.target.value)
                        }
                    />
                </Form.Group>
                <Form.Group controlId='edit.age'>
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='Age'
                        min={0}
                        max={120}
                        value={state.get('user.age')}
                        onChange={(e) =>
                            state.set(
                                'user.age',
                                e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                            )
                        }
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
    );
};

const Footer = ({
    state,
    onCancel = () => console.log('Cancel delete'),
    onSuccess = (user) => console.log('Save user', user),
}) => {
    return (
        <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>
                Cancel
            </Button>
            <Button
                variant='danger'
                disabled={!state.get('valid', false)}
                onClick={() => onSuccess(state.get('user'))}>
                Save
            </Button>
        </Modal.Footer>
    );
};

export const EditUser = ({
    user = {},
    onCancel = () => console.log('Cancel save'),
    onSuccess = (user) => console.log(`Save user ${user.id}`),
}) => {
    const { id, name, age, email } = user;
    const userObj = { id, name, age, email };
    const validateUser = (user = {}) => {
        return Boolean(user.name && user.email);
    };

    const state = useSyncState({
        valid: validateUser(userObj || {}),
        user: userObj,
    });

    state.extend('validate', () => {
        state.set('valid', validateUser(state.get('user', {})));
    });

    useEventEffect(state, {
        change: (e) => {
            state.validate();
        },
    });

    return (
        <>
            <Header state={state} />
            <Body state={state} />
            <Footer
                state={state}
                onCancel={onCancel}
                onSuccess={() => onSuccess(state.get('user', {}))}
            />
        </>
    );
};
