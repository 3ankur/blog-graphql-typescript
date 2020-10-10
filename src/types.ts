import { Connection } from "typeorm";

export type MyContext = {
  ormConnection: Connection;
  req: Request & { session: Express.Session };
};
