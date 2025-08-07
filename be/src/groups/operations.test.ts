import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import { execSync } from "child_process";
import { createGroup } from "./operations.ts";
import { DbClient, type DbConfig } from "../dbService.ts";
import { createUser } from "../user/operations.ts";

let dbClient: DbClient;

beforeAll(() => {
  const dbPort = Math.floor(Math.random() * 10000) + 20000;

  console.log("Starting db in port", dbPort);
  execSync(
    `DB_PORT=${dbPort.toString()} docker compose -f ../db/docker-compose.yml up -d db && DB_PORT=${dbPort.toString()} docker compose -f ../db/docker-compose.yml run migrate`,
  );

  const dbConfig: DbConfig = {
    database: "postgres",
    port: dbPort,
    password: "postgres",
    user: "postgres",
  };
  dbClient = new DbClient(dbConfig);
});

afterAll(async () => {
  await dbClient.end();
  execSync("docker compose -f ../db/docker-compose.yml down db");
});

describe("group operations", () => {
  test("Create a group", async () => {
    const userId = "some user id";
    await createUser({
      user: {
        id: userId,
      },
      db: dbClient,
    });
    await createGroup({
      group: {
        title: "Some group",
      },
      authContext: {
        userId: userId,
      },
      db: dbClient,
    });

    expect(1).toBe(1);
  });
});
