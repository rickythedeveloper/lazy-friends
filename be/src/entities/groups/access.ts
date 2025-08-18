import type { DbClient } from "../../db/dbService.ts";
import { z } from "zod";

export async function isUserInGroup({
  userId,
  groupId,
  db,
}: {
  userId: string;
  groupId: string;
  db: DbClient;
}) {
  const rows = await db.query({
    query: `
      SELECT true AS is_in_group
      FROM group_users
      WHERE group_id = $1 AND user_id = $2
    `,
    values: [groupId, userId],
    row_type: z.object({
      is_in_group: z.boolean(),
    }),
  });

  return rows.length > 0;
}
