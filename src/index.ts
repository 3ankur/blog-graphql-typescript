import "reflect-metadata";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const ormConnection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "blogger",
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post],
    synchronize: true,
  });

  const app = express();
  //   app.get("/", (_, res) => {
  //     res.send("Hello world");
  //   });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ ormConnection }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server stated at 4000");
  });

  //   const repository = conn.getRepository(Post);
  //   const post = new Post();
  //   post.title = "This is my first post.";
  //   post.createdAt = new Date();
  //   post.updatedAt = new Date();
  //   await repository.save(post);
};

main().catch((err) => {
  console.error(err);
});
console.log("Hellow Ankur");
