import { gql, useQuery } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import op from 'object-path';
import { useEffect } from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const GET_USERS = gql`
    query {
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
    }
`;

export const Dashboard = () => {
    const PostList = useHookComponent('PostList');
    const UserList = useHookComponent('UserList');

    const response = useQuery(GET_USERS);
    useEffect(() => {
        if (response.observable) {
            response.observable.subscribe({
                next: ({ data }) => {
                    console.log({ data });
                },
            });
        }
    }, [response.observable]);

    console.log({ response });
    return (
        <Container fluid as='main'>
            <h1>Dashboard</h1>
            <Row>
                <Col>
                    <UserList
                        {...response}
                        users={op.get(response, 'data.users', [])}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <PostList
                        {...response}
                        posts={op.get(response, 'data.posts', [])}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
