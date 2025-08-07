import type { AuthContext } from "../authContext/AuthContext.ts";
import type { DbClient } from "../db/dbService.ts";
import { z } from "zod";

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
      INSERT INTO groups (created_by, title)
      VALUES ($1, $2)
      RETURNING id
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
