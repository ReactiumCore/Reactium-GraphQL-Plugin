# Reactium GraphQL Plugin

Provides an Apollo GraphQL client to your Reactium project.

## About this Repository
This repository is a mono-style repo (for publishing the @reactium/graphql Reactium module to the Reactium registry), but it's also a Reactium project itself, complete with an example deno GraphQL server and a Reactium example front-end that uses the @reactium/graphql module.

See below for if you want to play around with this repository in your local environment.

## Install

To install this module in your own Reactium project:

```sh
npx reactium install @reactium/graphql
```

See [Configuration](#configuration) for environment variables to setup the plugin to work with your GraphQL server.

> By default looks for http://localhost:4000/graphql Change the `GRAPHQL_URL` environment variable if needed.

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

## Reactium Specific Hooks

When this module is installed in a Reactium project, it exposes it's own React hooks in the @reactium/graphql workspace.

* **useSyncQuery**: Wraps the Apollo GraphQL query hook, but makes it into a [ReactiumSyncState object](https://reactiumcore.github.io/reactium-sdk-core/classes/ReactiumSyncState.html) for easier memory state management. For those used to the Reactium improved [useSyncState hook](https://reactiumcore.github.io/reactium-sdk-core/functions/useSyncState.html) for improved component state management, with imperative state updates, as well as EventTarget extensibility and observability.

  ```jsx
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
        // Get registered components
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
  ```

## Configuration

There are a number of environment variables that this module will use in your Reactium project.

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

## Using this demo GraphQL server

This repository has an example deno server that runs a GraphQL server.

See `./GraphQLServer` for the deno server. You will need to have [deno installed](https://docs.deno.com/runtime/manual/) and configure your local mongo instance credentials, by adding the `MONGODB_URI` variable to `./GraphQLServer/.env`:

```
MONGODB_URI=mongodb://deno:denopwd@localhost:27017/deno
```
> Example local mongodb URI

I'd also recommend installing [denon](https://deno.land/x/denon@2.5.0/docs/installation.md?source=) (like nodemon for deno) for easy startup of the server locally:

```sh
cd ./GraphQLServer
denon start
```

## Starting the UI

This repository includes a Reactium project with a UI that can interact with the included Deno server.

To start the UI:

```sh
npx reactium install # first time to install dependencies (includes npm dependencies as well)
npm run local
```