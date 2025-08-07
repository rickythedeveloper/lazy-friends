import type { DbClient } from "../../db/dbService.ts";
import { z } from "zod";

interface CreateUserParams {
  id: string;
}

export async function createUser({
  user,
  db,
}: {
  user: CreateUserParams;
  db: DbClient;
}): Promise<{ id: string }> {
  const rows = await db.query({
    query: `
      INSERT INTO users (id)
      VALUES ($1)
      RETURNING id
    `,
    values: [user.id],
    row_type: z.object({ id: z.string() }),
  });

  const row = rows[0];
  if (!row) {
    throw new Error("Could not create user");
  }

  return {
    id: row.id,
  };
}
