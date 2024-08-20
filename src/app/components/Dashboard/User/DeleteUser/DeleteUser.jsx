import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Header = ({ user }) => {
    const { id, name } = user;
    return (
        <Modal.Header closeButton>
            <h1>Delete {name}</h1>
        </Modal.Header>
    );
};

const Body = ({ user }) => {
    return (
        <Modal.Body>
            <p>Are you sure you want to delete {user.name}?</p>
        </Modal.Body>
    );
};

const Footer = ({
    user,
    onCancel = () => console.log('Cancel delete'),
    onSuccess = (user) => console.log(`Delete user ${user.id}`),
}) => {
    const { id } = user;
    return (
        <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>
                Cancel
            </Button>
            <Button variant='danger' onClick={() => onSuccess(user)}>
                Delete
            </Button>
        </Modal.Footer>
    );
};

export const DeleteUser = ({
    user,
    onCancel = () => console.log('Cancel delete'),
    onSuccess = (user) => console.log(`Delete user ${user.id}`),
}) => {
    return (
        <>
            <Header user={user} />
            <Body user={user} />
            <Footer user={user} onCancel={onCancel} onSuccess={onSuccess} />
        </>
    );
};
