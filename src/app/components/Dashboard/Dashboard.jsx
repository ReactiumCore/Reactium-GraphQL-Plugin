import { gql } from '@apollo/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHookComponent } from 'reactium-core/sdk';
import { useSyncQuery } from '@reactium/graphql';

const LOAD_DASHBOARD_DATA = gql`
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
`;

export const Dashboard = () => {
    const PostList = useHookComponent('PostList');
    const UserList = useHookComponent('UserList');

    const handle = useSyncQuery(LOAD_DASHBOARD_DATA, {
        variables: { nums: [0, 1] },
    });

    return (
        <Container fluid as='main'>
            <h1>Dashboard {handle.get('data.add')}</h1>
            <Row>
                <Col>
                    <UserList
                        loading={handle.get('loading', false)}
                        error={handle.get('error')}
                        users={handle.get('data.users', [])}
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
