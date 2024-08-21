import { useSyncState } from '@atomic-reactor/reactium-core/sdk';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

export const PostList = ({
    loading = true,
    error,
    posts = [],
    onNew = () => console.log('New Post Clicked'),
    onEdit = (post) => console.log('Edit Post', post),
    onDelete = (post) => console.log('Delete Post', post),
}) => {
    return (
        <Accordion defaultActiveKey='0' className='posts'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>Posts</Accordion.Header>
                <Accordion.Body>
                    {error && <Alert variant='danger'>{error.message}</Alert>}
                    <Button
                        title='New Post'
                        onClick={onNew}
                        className='new-post mb-2'>
                        New Post
                    </Button>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Author</th>
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
                                    </tr>
                                ))}
                            {!loading &&
                                posts.map(
                                    ({
                                        id,
                                        title,
                                        body,
                                        author,
                                        published,
                                    }) => (
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td>{title}</td>
                                            <td>{body}</td>
                                            <td>
                                                {author
                                                    ? author.name
                                                    : 'Unknown'}
                                            </td>
                                            <td className='posts-actions'>
                                                <Button
                                                    title='Edit Post'
                                                    onClick={() =>
                                                        onEdit({
                                                            id,
                                                            title,
                                                            body,
                                                            author,
                                                            published,
                                                        })
                                                    }>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                    />
                                                </Button>
                                                <Button
                                                    title='Delete Post'
                                                    onClick={() =>
                                                        console.log(
                                                            'Delete Post',
                                                            id,
                                                        )
                                                    }>
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};
