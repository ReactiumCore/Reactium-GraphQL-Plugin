import { gql } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHookComponent, useHandle } from 'reactium-core/sdk';
import { useSyncQuery } from '@reactium/graphql';
import * as DeleteUser from './User/DeleteUser/DeleteUser';

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
                }

                posts {
                    id
                    title
                    body
                }

                add(nums: $nums)
            }
        `,
        {
            variables: { nums: [0, 1] },
        },
    );

    const Modal = useHandle('Modal');
    const confirmDelete = (user) => {
        Modal.set(
            {
                header: <DeleteUser.Header user={user} />,
                body: <DeleteUser.Body user={user} />,
                footer: (
                    <DeleteUser.Footer
                        user={user}
                        onCancel={() => Modal.close()}
                        onSuccess={async () => {
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
                        }}
                    />
                ),
            },
            false,
        );
        Modal.open();
    };

    return (
        <Container fluid as='main'>
            <h1>Dashboard {handle.get('data.add')}</h1>
            <Row>
                <Col>
                    <UserList
                        loading={handle.get('loading', false)}
                        error={handle.get('error')}
                        users={handle.get('data.users', [])}
                        onDelete={confirmDelete}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <PostList
                        loading={handle.get('loading', false)}
                        error={handle.get('error')}
                        posts={handle.get('data.posts', [])}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
