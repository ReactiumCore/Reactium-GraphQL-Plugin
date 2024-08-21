import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Header = ({ post }) => {
    const { id, title } = post;
    return (
        <Modal.Header closeButton>
            <h1>Delete "{title}"</h1>
        </Modal.Header>
    );
};

const Body = ({ post }) => {
    return (
        <Modal.Body>
            <p>Are you sure you want to delete post "{post.title}"?</p>
        </Modal.Body>
    );
};

const Footer = ({
    post,
    onCancel = () => console.log('Cancel delete'),
    onSuccess = (post) => console.log(`Delete post ${post.id}`),
}) => {
    const { id } = post;
    return (
        <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>
                Cancel
            </Button>
            <Button variant='danger' onClick={() => onSuccess(post)}>
                Delete
            </Button>
        </Modal.Footer>
    );
};

export const DeletePost = ({
    post,
    onCancel = () => console.log('Cancel delete'),
    onSuccess = (post) => console.log(`Delete post ${post.id}`),
}) => {
    return (
        <>
            <Header post={post} />
            <Body post={post} />
            <Footer post={post} onCancel={onCancel} onSuccess={onSuccess} />
        </>
    );
};
