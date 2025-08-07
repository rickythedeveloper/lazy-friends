// eslint-disable-next-line no-restricted-imports
import { Pool, type PoolClient } from "pg";
import { z } from "zod";

export interface DbConfig {
  database: string;
  port: number;
  password: string;
  user: string;
}

const DB_CONFIG: DbConfig = {
  database: "postgres",
  port: 5432,
  password: "postgres",
  user: "postgres",
};

export function getDbConnection(): DbClient {
  return new DbClient(DB_CONFIG);
}

export type DbValue = string | number | boolean | null;

export class DbClient {
  private _pool: Pool;
  private _client?: PoolClient;

  constructor(config: DbConfig) {
    this._pool = new Pool(config);
  }

  private async getClient(): Promise<PoolClient> {
    if (!this._client) {
      this._client = await this._pool.connect();
    }

    return this._client;
  }

  async query<Row extends z.ZodObject>({
    query,
    values,
    row_type,
  }: {
    query: string;
    values?: DbValue[];
    row_type: Row;
  }): Promise<z.infer<Row>[]> {
    const rows = await (await this.getClient()).query(query, values);

    const validatedRows = z.array(row_type).parse(rows.rows);

    return validatedRows;
  }

  async beginTransaction() {
    await (await this.getClient()).query("BEGIN");
  }

  async commit() {
    await (await this.getClient()).query("COMMIT");
  }

  async rollback() {
    await (await this.getClient()).query("ROLLBACK");
  }

  async end() {
    if (this._client) {
      this._client.release();
      await this._pool.end();
    }
  }
}
