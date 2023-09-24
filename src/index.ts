import { ApolloServer } from "apollo-server";
import typeormConfig from "../typeorm.config"
import { schema } from './schema'

const boot =  async () => {

    const conn = await typeormConfig.initialize()
    if(conn.isInitialized){
        console.log("Database connected")
    }

    const apolloServer = new ApolloServer({
        schema,
    });
    apolloServer.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

boot();