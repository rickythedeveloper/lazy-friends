import { afterAll, beforeAll, describe, test } from "@jest/globals";

import { createGroup } from "./operations.ts";
import { DbClient } from "../../db/dbService.ts";
import { createUser } from "../users/operations.ts";
import {
  startTestDbAndGetDbClient,
  tearDownTestDb,
  type TestDbConfig,
} from "../../testUtils/setup.ts";

let dbClient: DbClient;
let dbConfig: TestDbConfig;

beforeAll(() => {
  const { client, config } = startTestDbAndGetDbClient();
  dbClient = client;
  dbConfig = config;
});

afterAll(async () => {
  await dbClient.end();
  tearDownTestDb(dbConfig);
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
  });
});
