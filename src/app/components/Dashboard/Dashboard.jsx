import { gql } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHookComponent, useHandle } from 'reactium-core/sdk';
import { useSyncQuery } from '@reactium/graphql';
import { DeleteUser } from './User/DeleteUser/DeleteUser';
import { EditUser } from './User/EditUser/EditUser';

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
                }

                add(nums: $nums)
            }
        `,
        {
            variables: { nums: [0, 1] },
        },
    );

    const Modal = useHandle('Modal');
    const editUser = async (user = {}) => {
        const saveUser = async (userObj) => {
            console.log('saveUser', userObj);
            const client = handle.get('client');
            await client.mutate({
                mutation: gql`
                    mutation SaveUser($userObj: SaveUserInput) {
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
    };

    const confirmDeleteUser = (user) => {
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
                        onNew={editUser}
                        onEdit={editUser}
                        onDelete={confirmDeleteUser}
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
