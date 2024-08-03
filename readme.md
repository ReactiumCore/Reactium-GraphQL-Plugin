# Reactium GraphQL Plugin

Provides an Apollo GraphQL client on Reactium.GraphQL singleton in Reactium project.

## Install

```sh
npx reactium install @reactium/graphql
```

## Usage

See [Apollo Client (React)](https://www.apollographql.com/docs/react) documentation for full details.

This plugin already sets up the Apollo client as a context provider for the Reactium application, so you can begin using the `gql` with React hooks immediately.

```jsx
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

export const UsersList = () => {
    const { loading, error, data } = useQuery(GET_USERS);
    if (loading) return <div>Loading...</div>;
    else if (error) return <div>Error: {error}</div>;
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
```

## Configuration

- **GraphQL Playground** - Enabled by default in local development, disabled by default in production environment. To set the playground URL **(Defaults to `/playground`)**, set the environment variable `GRAPHQL_PLAYGROUND_URL`
  
  ```bash
  export GRAPHQL_PLAYGROUND_URL="/my-playground"
  ```

  To enable playground in production, set `GRAPHQL_PLAYGROUND_ENABLED=on`
- **GraphQL Server URL** - To set the GraphQL server URL (defaults to localhost:4000/graphql):
    ```bash
    export GRAPHQL_URL="https://my.graphql.host/graphql"
    ```
- **GraphQL Proxy** - Enabled by default, Reactium will proxy `/graphql` to the GraphQL Server URL (See above). If this behavior is disabled, the Apollo Client will use your server URL directly (You will be responsible for setting up your GraphQL Server for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)). To disable proxy behavior:
    
    ```bash
    export GRAPHQL_PROXY_ENABLED="off"
    ```

    The default proxy URL (provided by http-proxy middleware) for your GraphQL api is `/graphql`. To change this:

    ```bash
    export GRAPHQL_PROXY_URL="/my-graphql-api"
    ```
    > Note: Changing this proxy URL will also change the default GraphQL Server URL (unless you have set it with `GRAPHQL_URL`)