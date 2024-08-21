import { gql } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHookComponent, useHandle } from 'reactium-core/sdk';
import { useSyncQuery } from '@reactium/graphql';
import { DeleteUser } from './User/DeleteUser/DeleteUser';
import { EditUser } from './User/EditUser/EditUser';
import { EditPost } from './Post/EditPost/EditPost';
import { DeletePost } from './Post/DeletePost/DeletePost';

const getUserActions = (handle, Modal) => {
    const user = {
        onEdit: async (user = {}) => {
            const saveUser = async (userObj) => {
                const client = handle.get('client');
                await client.mutate({
                    mutation: gql`
                        mutation SaveUser($userObj: SaveUserInput!) {
                            saveUser(input: $userObj) {
                                id
                                name
                                email
                            }
                        }
                    `,
                    variables: { userObj },
                });

                Modal.close();
                await handle.refresh();
            };

            Modal.set({
                content: (
                    <EditUser
                        user={{ ...user }}
                        onCancel={() => Modal.close()}
                        onSuccess={saveUser}
                    />
                ),
            });
            Modal.open();
        },

        onDelete: async (user) => {
            const deleteUser = async () => {
                const client = handle.get('client');
                await client.mutate({
                    mutation: gql`
                        mutation DeleteUser($id: ID!) {
                            deleteUser(id: $id) {
                                success
                                message
                            }
                        }
                    `,
                    variables: { id: user.id },
                });

                Modal.close();
                await handle.refresh();
            };

            Modal.set({
                content: (
                    <DeleteUser
                        user={user}
                        onCancel={() => Modal.close()}
                        onSuccess={deleteUser}
                    />
                ),
            });
            Modal.open();
        },
    };

    user.onNew = user.onEdit;
    return user;
};

const getPostActions = (handle, Modal) => {
    const post = {
        onEdit: async (post = {}) => {
            const savePost = async (postObj) => {
                const client = handle.get('client');
                const savedPost = await client.mutate({
                    mutation: gql`
                        mutation SavePost($postObj: SavePostInput!) {
                            savePost(input: $postObj) {
                                id
                                title
                                author {
                                    id
                                    name
                                }
                            }
                        }
                    `,
                    variables: { postObj },
                });

                Modal.close();
                await handle.refresh();
            };

            Modal.set({
                content: (
                    <EditPost
                        post={{ ...post }}
                        users={handle.get('data.users', [])}
                        onCancel={() => Modal.close()}
                        onSuccess={savePost}
                    />
                ),
            });
            Modal.open();
        },
        onDelete: async (post) => {
            const deletePost = async () => {
                const client = handle.get('client');
                await client.mutate({
                    mutation: gql`
                        mutation DeletePost($id: ID!) {
                            deletePost(id: $id) {
                                success
                                message
                            }
                        }
                    `,
                    variables: { id: post.id },
                });

                Modal.close();
                await handle.refresh();
            };

            Modal.set({
                content: (
                    <DeletePost
                        post={post}
                        onCancel={() => Modal.close()}
                        onSuccess={deletePost}
                    />
                ),
            });
            Modal.open();
        },
    };

    post.onNew = post.onEdit;

    return post;
};

const getActions = (handle, Modal) => {
    return {
        user: getUserActions(handle, Modal),
        post: getPostActions(handle, Modal),
    };
};

export const Dashboard = () => {
    const PostList = useHookComponent('PostList');
    const UserList = useHookComponent('UserList');
    const handle = useSyncQuery(
        gql`
            query LoadDashboardDat($nums: [Int!]!) {
                users {
                    id
                    name
                    email
                    age
                }

                posts {
                    id
                    title
                    body
                    author {
                        id
                        name
                    }
                    published
                }

                add(nums: $nums)
            }
        `,
        {
            variables: { nums: [0, 1] },
        },
    );

    const Modal = useHandle('Modal');
    const actions = getActions(handle, Modal);

    return (
        <Container fluid as='main'>
            <h1>Dashboard {handle.get('data.add')}</h1>
            <Row>
                <Col>
                    <UserList
                        loading={handle.get('loading', false)}
                        error={handle.get('error')}
                        users={handle.get('data.users', [])}
                        {...actions.user}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <PostList
                        loading={handle.get('loading', false)}
                        error={handle.get('error')}
                        posts={handle.get('data.posts', [])}
                        {...actions.post}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
