import { Connection } from "typeorm";

export type MyContext = {
  ormConnection: Connection;
};
