import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    useSyncState,
    useEventEffect,
} from '@atomic-reactor/reactium-core/sdk';

const Header = ({ state }) => {
    const { id, title } = state.get('post', { title: '' });
    return (
        <Modal.Header closeButton>
            <h1>{id ? `Update ${title}` : `Create ${title || 'Post'}`}</h1>
        </Modal.Header>
    );
};

const Body = ({ state }) => {
    const authors = state.get('users', []);
    return (
        <Modal.Body>
            <Form>
                <Form.Group controlId='edit.title'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Title'
                        value={state.get('post.title', '')}
                        onChange={(e) =>
                            state.set('post.title', e.target.value)
                        }
                    />
                </Form.Group>
                <Form.Group controlId='edit.body'>
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        as='textarea'
                        placeholder='Body'
                        value={state.get('post.body', '')}
                        onChange={(e) => state.set('post.body', e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='edit.author'>
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                        as='select'
                        value={state.get('post.authorId', '')}
                        onChange={(e) =>
                            state.set('post.authorId', e.target.value)
                        }>
                        <option value=''>Select Author</option>
                        {authors.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='edit.published'>
                    <Form.Label>Published Status</Form.Label>
                    <Form.Check
                        type='switch'
                        label={
                            state.get('post.published', false)
                                ? 'Published'
                                : 'Draft'
                        }
                        checked={state.get('post.published', false)}
                        onChange={(e) =>
                            state.set('post.published', e.target.checked)
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
    onSuccess = (post) => console.log('Save post', post),
}) => {
    return (
        <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>
                Cancel
            </Button>
            <Button
                variant='danger'
                disabled={!state.get('valid', false)}
                onClick={() => onSuccess(state.get('post'))}>
                Save
            </Button>
        </Modal.Footer>
    );
};

export const EditPost = ({
    post = {},
    users = [],
    onCancel = () => console.log('Cancel save'),
    onSuccess = (post) => console.log(`Save post ${post.id}`),
}) => {
    const { id, title, body, author, published = false } = post;
    const postObj = {
        id,
        title,
        body,
        authorId: author ? author.id : '',
        published,
    };
    const validatePost = (post = {}) => {
        return Boolean(post.title && post.body);
    };

    const state = useSyncState({
        valid: validatePost(postObj || {}),
        post: postObj,
        users,
    });

    state.extend('validate', () => {
        state.set('valid', validatePost(state.get('post', {})));
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
                onSuccess={() => onSuccess(state.get('post', {}))}
            />
        </>
    );
};
