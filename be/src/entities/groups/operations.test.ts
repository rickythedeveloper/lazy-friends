import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import {
  addUsersToGroup,
  createGroup,
  getGroups,
  getUsersInGroup,
} from "./operations.ts";
import { DbClient } from "../../db/dbService.ts";
import { createUser } from "../users/operations.ts";
import {
  startTestDbAndGetDbClient,
  tearDownTestDb,
  type TestDbConfig,
} from "../../testUtils/setup.ts";
import type { AuthContext } from "../../authContext/AuthContext.ts";
import { DbError } from "../../server/errors.ts";

let dbClient: DbClient;
let dbConfig: TestDbConfig;

const TEST_USER_1_AUTH_CONTEXT: AuthContext = { userId: "some user id 1" };
const TEST_USER_2_AUTH_CONTEXT: AuthContext = { userId: "some user id 2" };
const TEST_USER_3_AUTH_CONTEXT: AuthContext = { userId: "some user id 3" };

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
    for (const authContext of [
      TEST_USER_1_AUTH_CONTEXT,
      TEST_USER_2_AUTH_CONTEXT,
      TEST_USER_3_AUTH_CONTEXT,
    ]) {
      await createUser({
        user: {
          id: authContext.userId,
        },
        db: dbClient,
      });
    }
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

  describe("addUsersToGroup", () => {
    let groupId: string;
    beforeAll(async () => {
      const createdGroup = await createGroup({
        group: {
          title: "Some group",
        },
        authContext: TEST_USER_1_AUTH_CONTEXT,
        db: dbClient,
      });
      groupId = createdGroup.id;
    });

    test("Add users to group", async () => {
      await addUsersToGroup({
        groupId,
        userIds: [
          TEST_USER_2_AUTH_CONTEXT.userId,
          TEST_USER_3_AUTH_CONTEXT.userId,
        ],
        authContext: TEST_USER_1_AUTH_CONTEXT,
        db: dbClient,
      });

      const users = await getUsersInGroup({
        groupId,
        authContext: TEST_USER_1_AUTH_CONTEXT,
        db: dbClient,
      });

      expect(new Set(users)).toEqual(
        new Set([
          TEST_USER_1_AUTH_CONTEXT.userId,
          TEST_USER_2_AUTH_CONTEXT.userId,
          TEST_USER_3_AUTH_CONTEXT.userId,
        ]),
      );
    });

    test("Adding a duplicate user to a group fails", async () => {
      await expect(
        addUsersToGroup({
          groupId,
          userIds: [TEST_USER_1_AUTH_CONTEXT.userId],
          authContext: TEST_USER_1_AUTH_CONTEXT,
          db: dbClient,
        }),
      ).rejects.toThrow(DbError);
    });
  });
});
