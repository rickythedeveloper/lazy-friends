import { DbClient, type DbConfig } from "./dbService.ts";

const DB_CONFIG: DbConfig = {
  database: "postgres",
  port: 5432,
  password: "postgres",
  user: "postgres",
};

export function getDbClient(): DbClient {
  return new DbClient(DB_CONFIG);
}
