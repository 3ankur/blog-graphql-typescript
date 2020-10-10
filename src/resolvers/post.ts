import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { ormConnection }: MyContext): Promise<Post[]> {
    const repository = ormConnection.getRepository(Post);
    return repository.find();
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { ormConnection }: MyContext
  ): Promise<Post | undefined | null> {
    const repository = ormConnection.getRepository(Post);
    return repository.findOne({ id });
  }

  @Mutation(() => Post)
  createPost(
    @Arg("title") title: string,
    @Ctx() { ormConnection }: MyContext
  ): Promise<Post> {
    const repository = ormConnection.getRepository(Post);
    const post = new Post();
    post.title = title;
    post.createdAt = new Date();
    post.updatedAt = new Date();
    return repository.save(post);
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { ormConnection }: MyContext
  ): Promise<Post | null> {
    const repository = ormConnection.getRepository(Post);
    const post = await repository.findOne({ id });
    if (post) {
      post.title = title;
      post.updatedAt = new Date();
      return await repository.save(post);
    }
    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { ormConnection }: MyContext
  ): Promise<boolean | null> {
    const repository = ormConnection.getRepository(Post);
    const post = await repository.findOne({ id });
    if (post) {
      await repository.delete({ id });
      return true;
    }
    return null;
  }
}
