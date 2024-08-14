import { useSyncState } from '@atomic-reactor/reactium-core/sdk';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';

export const PostList = ({ loading = true, error, posts = [] }) => {
    console.log({ loading, error, posts });
    return (
        <Accordion defaultActiveKey='0' className='posts'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>Posts</Accordion.Header>
                <Accordion.Body>
                    {error && <Alert variant='danger'>{error.message}</Alert>}
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Body</th>
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
                                posts.map(({ id, title, body }) => (
                                    <tr key={id}>
                                        <td>{id}</td>
                                        <td>{title}</td>
                                        <td>{body}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};
