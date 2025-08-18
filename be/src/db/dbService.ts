// eslint-disable-next-line no-restricted-imports
import { Pool, type PoolClient } from "pg";
import { z } from "zod";
import { DbError } from "../server/errors.ts";

export interface DbConfig {
  database: string;
  port: number;
  password: string;
  user: string;
}

export type DbValue = string | number | boolean | string[] | number[] | null;

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
    let rows: { rows: unknown[] };
    try {
      rows = await (await this.getClient()).query(query, values);
    } catch (err) {
      throw new DbError("Query failed", err);
    }

    const validatedRows = z.array(row_type).parse(rows.rows);

    return validatedRows;
  }

  async queryNonReturning({
    query,
    values,
  }: {
    query: string;
    values?: DbValue[];
  }): Promise<void> {
    try {
      await (await this.getClient()).query(query, values);
    } catch {
      throw new DbError("Query failed");
    }
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
