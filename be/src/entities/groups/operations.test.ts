import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import { createGroup, getGroups } from "./operations.ts";
import { DbClient } from "../../db/dbService.ts";
import { createUser } from "../users/operations.ts";
import {
  startTestDbAndGetDbClient,
  tearDownTestDb,
  type TestDbConfig,
} from "../../testUtils/setup.ts";
import type { AuthContext } from "../../authContext/AuthContext.ts";

let dbClient: DbClient;
let dbConfig: TestDbConfig;

const TEST_USER_1_AUTH_CONTEXT: AuthContext = { userId: "some user id 1" };
const TEST_USER_2_AUTH_CONTEXT: AuthContext = { userId: "some user id 2" };

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
  beforeAll(async () => {
    await createUser({
      user: {
        id: TEST_USER_1_AUTH_CONTEXT.userId,
      },
      db: dbClient,
    });
  });

  test("Create a group", async () => {
    await createGroup({
      group: {
        title: "Some group",
      },
      authContext: TEST_USER_1_AUTH_CONTEXT,
      db: dbClient,
    });
  });

  describe("Get groups", () => {
    beforeAll(async () => {
      await createGroup({
        group: {
          title: "Some group",
        },
        authContext: TEST_USER_1_AUTH_CONTEXT,
        db: dbClient,
      });
    });

    test("Get groups", async () => {
      let groups = await getGroups({
        authContext: TEST_USER_1_AUTH_CONTEXT,
        db: dbClient,
      });
      expect(groups.length).toBeGreaterThan(0);

      groups = await getGroups({
        authContext: TEST_USER_2_AUTH_CONTEXT,
        db: dbClient,
      });
      expect(groups).toHaveLength(0);
    });
  });
});
