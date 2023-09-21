import { ApolloServer } from "apollo-server";
import { schema } from './schema'

const boot = () => {
    const apolloServer = new ApolloServer({
        schema,
    });
    apolloServer.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

boot(); 