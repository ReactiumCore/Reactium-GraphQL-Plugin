import { gql, useQuery } from '@apollo/client';
import React from 'react';

const GET_USERS = gql`
    query GetUsers {
        users {
            id
            name
            email
        }
    }
`;

export const ApolloTest = () => {
    const { loading, error, data } = useQuery(GET_USERS);
    if (loading) return <div>Loading...</div>;
    else if (error) return <div>Error :(</div>;
    const { users } = data;

    return (
        <ul>
            {users.map(({ id, name, email }) => (
                <li key={id}>
                    {name}: {email}
                </li>
            ))}
        </ul>
    );
};

export default ApolloTest;
