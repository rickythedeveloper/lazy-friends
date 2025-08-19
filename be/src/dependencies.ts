import { getDbClient } from "./db/connection.ts";
import { type AuthBroker, AuthBrokerImpl } from "./authBroker.ts";
import type { Request } from "express";
import {
  type AuthContext,
  getAuthContextOrThrow,
} from "./authContext/AuthContext.ts";
import type { DbClient } from "./db/dbService.ts";

export interface Dependencies<Authenticated extends boolean> {
  authContext: Authenticated extends true ? AuthContext : undefined;
  db: DbClient;
  authBroker: AuthBroker;
}

export function getDependenciesWithoutAuth(): Dependencies<false> {
  return {
    authContext: undefined,
    db: getDbClient(),
    authBroker: new AuthBrokerImpl(),
  };
}

export function getDependenciesWithAuth({
  req,
}: {
  req: Request;
}): Dependencies<true> {
  return {
    authContext: getAuthContextOrThrow(req),
    db: getDbClient(),
    authBroker: new AuthBrokerImpl(),
  };
}

export async function cleanupDependencies({ db }: Dependencies<boolean>) {
  await db.end();
}
