import { useSyncState } from '@atomic-reactor/reactium-core/sdk';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

export const UserList = ({
    loading = true,
    error,
    users = [],
    onNew = console.log,
    onEdit = console.log,
    onDelete = console.log,
}) => {
    return (
        <Accordion defaultActiveKey='0' className='users'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>Users</Accordion.Header>
                <Accordion.Body>
                    {error && <Alert variant='danger'>{error.message}</Alert>}
                    <Button
                        title='New User'
                        onClick={onNew}
                        className='new-user mb-2'>
                        New User
                    </Button>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading &&
                                [...Array(5)].map((_, i) => (
                                    <tr key={`placeholder-${i}`}>
                                        <td>
                                            <Placeholder xs={6} />
                                        </td>
                                        <td>
                                            <Placeholder xs={6} />
                                        </td>
                                        <td>
                                            <Placeholder xs={6} />
                                        </td>
                                        <td>
                                            <Placeholder xs={6} />
                                        </td>
                                    </tr>
                                ))}
                            {!loading &&
                                users.map((user) => {
                                    const { id, name, email } = user;

                                    return (
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td>{name}</td>
                                            <td>{email}</td>
                                            <td className='users-actions'>
                                                <Button
                                                    title={`Edit User ${id}`}
                                                    onClick={() =>
                                                        onEdit(user)
                                                    }>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                    />
                                                </Button>
                                                <Button
                                                    title={`Delete User ${id}`}
                                                    onClick={() =>
                                                        onDelete(user)
                                                    }>
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};
