import { extendType, nonNull, objectType, stringArg } from "nexus";
import argon2 from "argon2";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

import { Context } from "../types/Context";
import { User } from "../entities/User";

export const userType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id"),
      t.nonNull.string("username"),
      t.nonNull.string("password"),
      t.nonNull.string("email");
  },
});

export const UserQuerry = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      resolve: async () : Promise<User[]> => {
        const users = await User.find();
        return users;
      }
    })
  }
})

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "AuthType",
      args: { username: nonNull(stringArg()), password: nonNull(stringArg())},
      async resolve(_parent, args, _context: Context, _info ){
        const { username, password } = args;
        const user = await User.findOne({ where: { username } });
        if(!user){
          throw new Error("User not found");
        }

        const isValid = await argon2.verify(user.password, password);

        if(!isValid){
          throw new Error("Invalid credentials");
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as jwt.Secret);
        return {user, token}
      }
    });

    t.nonNull.field("register", {
      type: "AuthType",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        const { username, password, email } = args;

        const hashedPassword = await argon2.hash(password);
        let user;
        let token
        try {
          const result = await context.conn
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({ username, email, password: hashedPassword })
            .returning("*")
            .execute();

            user = result.raw[0]
            token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET_KEY as jwt.Secret )
        } catch (error) {
          console.log(error)
        }
        return { user, token }
      },
    });
  },
});
