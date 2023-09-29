import { ApolloServer } from "apollo-server";
import typeormConfig from "../typeorm.config"
import { schema } from './schema'
import { Context } from "./types/Context";
import { auth } from "./midddlewares/auth";

const boot =  async () => {

    const conn = await typeormConfig.initialize()
    if(conn.isInitialized){
        console.log(" Database connected")
    }

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }): Context => {
            const token = req?.headers.authorization ? auth(req.headers.authorization) : null
            return { conn, userId: token?.userId }
        }
    });
    apolloServer.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

boot();