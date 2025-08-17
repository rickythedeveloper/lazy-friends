import type { AuthContext } from "../../authContext/AuthContext.ts";
import type { DbClient } from "../../db/dbService.ts";
import { z } from "zod";

export async function getGroups({
  db,
}: {
  db: DbClient;
}): Promise<{ id: string; title: string }[]> {
  const rows = await db.query({
    query: `
      SELECT id, title
      FROM groups
    `,
    row_type: z.object({
      id: z.uuid(),
      title: z.string(),
    }),
  });

  return rows;
}

interface CreateGroupParams {
  title: string;
}

export async function createGroup({
  group,
  authContext,
  db,
}: {
  group: CreateGroupParams;
  authContext: AuthContext;
  db: DbClient;
}): Promise<{ id: string }> {
  const rows = await db.query({
    query: `
      WITH inserted_group AS (
        INSERT INTO groups (created_by, title)
        VALUES ($1, $2)
        RETURNING id  
      )
      INSERT INTO group_users (group_id, user_id)
      SELECT id, $1
      FROM inserted_group
      RETURNING group_id AS id
    `,
    values: [authContext.userId, group.title],
    row_type: z.object({ id: z.uuid() }),
  });

  const row = rows[0];
  if (!row) {
    throw new Error("Could not create group");
  }

  return {
    id: row.id,
  };
}
