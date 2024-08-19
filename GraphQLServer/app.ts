import { Application, Router } from 'oak.ts';
import { applyGraphQL, gql, GQLError } from 'oak_graphql.ts';
import { User } from './User/User.ts';
import { Post } from './Post/Post.ts';
import _ from 'underscore.ts';

const app = new Application();

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get('X-Response-Time');
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

const typeDefs = gql`
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User
    }

    type SuccessOrError {
        success: Boolean!
        message: String
    }

    type Query {
        testInput(input: CreateUserInput!): User
        me: User!
        user(id: ID!): User
        users: [User]!
        post(id: ID!): Post
        posts(query: String): [Post!]!
        grades: [Int!]!
        add(nums: [Int!]!): Int!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        deleteUser(id: ID!): SuccessOrError!
        createPost(title: String!, body: String!, published: Boolean!): Post!
    }
`;

// console.log(JSON.stringify(typeDefs, null, 2));

const resolvers = {
    Query: {
        testInput: async (
            parent: any,
            { input }: { input: { name: string; email: string; age?: number } },
            context: any,
            info: any,
        ) => {
            return { id: 'wtf', ...input };
        },
        grades: async (parent: any, args: any, context: any, info: any) => {
            return [1, 2, 3, 4, 5];
        },
        add: async (
            parent: any,
            { nums }: { nums: number[] },
            context: any,
            info: any,
        ) => {
            return nums.reduce((a, b) => a + b, 0);
        },
        me: async (parent: any, args: any, context: any, info: any) => {
            return {
                id: 'jdillick',
                name: 'John',
                email: 'john@dillick.us',
            };
        },

        user: async (parent: any, { id }: any, context: any, info: any) => {
            const user = await User.load(id);
            return user;
        },

        users: async (parent: any, args: any, context: any, info: any) => {
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            const users = User.find();
            return users;
        },

        post: async (
            parent: any,
            { id }: { id: number },
            context: any,
            info: any,
        ) => {
            console.log({ id });
            return {
                id: 123,
                title: 'Hello World',
                body: 'This is a post.',
                published: true,
            };
        },

        posts: async (parent: any, { query }: any, context: any, info: any) => {
            if (query) {
                return Post.find({ title: { $regex: query, $options: 'i' } });
            }
            return Post.find();
        },
    },
    Mutation: {
        createUser: async (
            parent: any,
            { name, email, age }: { name: string; email: string; age?: number },
            context: any,
            info: any,
        ) => {
            const user = new User({ name, email, age });
            await user.save();
            return user;
        },
        deleteUser: async (
            parent: any,
            { id }: { id: string },
            context: any,
            info: any,
        ) => {
            try {
                const user = await User.delete(id);
                return { success: true };
            } catch (e) {
                return { success: false, message: e.message };
            }
        },
        createPost: async (
            parent: any,
            {
                title,
                body,
                published,
            }: {
                title: string;
                body: string;
                published: boolean;
            },
            context: any,
            info: any,
        ) => {
            const post = new Post({ title, body, published });
            await post.save();
            return post;
        },
    },
};

const GraphQLService = await applyGraphQL<Router>({
    Router,
    typeDefs,
    resolvers,
    context: (ctx) => {
        // this line is for passing a user context for the auth
        return { user: 'Boo' };
    },
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log('Server start at http://localhost:4000');
await app.listen({ port: 4000 });
