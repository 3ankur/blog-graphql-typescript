import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: [FieldError];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: String;
}

@Resolver()
export class UserResolver {
  @Query(() => [Post])
  posts(@Ctx() { ormConnection }: MyContext): Promise<Post[]> {
    const repository = ormConnection.getRepository(Post);
    return repository.find();
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("registerInput") options: UsernamePasswordInput,
    @Ctx() { ormConnection }: MyContext
  ) {
    const { username, password } = options;
    const errors = [];
    if (username.length <= 2) {
      errors.push({
        field: "username",
        message: "username length should be greater then 2",
      });
      return {
        errors,
      };
    }
    if (password.length <= 2) {
      errors.push({
        field: "password",
        message: "password length should be greater then 2",
      });
      return {
        errors,
      };
    }
    try {
      const repository = ormConnection.getRepository(User);
      const hashPassword = await argon2.hash(password);
      const user = new User();
      user.username = username;
      user.password = hashPassword;
      user.createdAt = new Date();
      user.updatedAt = new Date();
      return await repository.save(user);
    } catch (err) {
      console.log(err.code);

      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username alrady exists",
            },
          ],
        };
      }
      return err;
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { ormConnection, req }: MyContext
  ): Promise<UserResponse> {
    const repository = ormConnection.getRepository(User);
    const user = await repository.findOne({ username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username not found",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid password",
          },
        ],
      };
    }

    req.session.userid = user.id.toString();
    return { user };
  }
}
