import { afterAll, beforeAll, describe, test } from "@jest/globals";

import { createUser } from "./operations.ts";
import { DbClient } from "../../db/dbService.ts";
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

describe("user operations", () => {
  test("Create a user", async () => {
    const userId = "some user id";
    await createUser({
      user: {
        id: userId,
      },
      db: dbClient,
    });
  });
});
