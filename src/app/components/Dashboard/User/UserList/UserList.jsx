import { useSyncState } from '@atomic-reactor/reactium-core/sdk';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';

export const UserList = ({ loading = true, error, users = [] }) => {
    console.log({ loading, error, users });
    return (
        <Accordion defaultActiveKey='0' className='users'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>Users</Accordion.Header>
                <Accordion.Body>
                    {error && <Alert variant='danger'>{error.message}</Alert>}
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
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
                                    </tr>
                                ))}
                            {!loading &&
                                users.map(({ id, name, email }) => (
                                    <tr key={id}>
                                        <td>{id}</td>
                                        <td>{name}</td>
                                        <td>{email}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};
