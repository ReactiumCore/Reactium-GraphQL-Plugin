import React from 'react';
import Button from 'react-bootstrap/Button';

export const Header = ({ user }) => {
    const { id, name } = user;
    return <h1>Delete {name}</h1>;
};

export const Body = ({ user }) => {
    return <p>Are you sure you want to delete {user.name}?</p>;
};

export const Footer = ({
    user,
    onCancel = () => console.log('Cancel delete'),
    onSuccess = (user) => console.log(`Delete user ${user.id}`),
}) => {
    const { id } = user;
    return (
        <>
            <Button variant='secondary' onClick={onCancel}>
                Cancel
            </Button>
            <Button variant='danger' onClick={() => onSuccess(user)}>
                Delete
            </Button>
        </>
    );
};
