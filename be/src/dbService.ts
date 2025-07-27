import { Pool, type PoolClient, type QueryResult } from "pg";

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

class DbClient {
  constructor(private client: PoolClient) {}

  async query({ query }: { query: string }): Promise<QueryResult> {
    return await this.client.query(query);
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
