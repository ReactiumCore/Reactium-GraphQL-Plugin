# Reactium GraphQL Plugin

Provides an Apollo GraphQL client on Reactium.GraphQL singleton in Reactium project.

## Install

`npx reactium install @reactium/graphql`

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