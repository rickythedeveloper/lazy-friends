import { Pool, type PoolClient } from "pg";
import { z } from "zod";

const pool = new Pool({
  database: "postgres",
  port: 5432,
  password: "postgres",
  user: "postgres",
});

export async function getDbConnection(): Promise<DbClient> {
  const client = await pool.connect();

  return new DbClient(client);
}

export type DbValue = string | number | boolean | null;

export class DbClient {
  constructor(private client: PoolClient) {}

  async query<Row extends z.ZodObject>({
    query,
    values,
    row_type,
  }: {
    query: string;
    values?: DbValue[];
    row_type: Row;
  }): Promise<z.infer<Row>[]> {
    const rows = await this.client.query(query, values);

    const validatedRows = z.array(row_type).parse(rows.rows);

    return validatedRows;
  }

  async beginTransaction() {
    await this.client.query("BEGIN");
  }

  async commit() {
    await this.client.query("COMMIT");
  }

  async rollback() {
    await this.client.query("ROLLBACK");
  }
}
