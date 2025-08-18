import type { Dependencies } from "./apiDefinition.ts";

export async function cleanupDependencies({ db }: Dependencies<boolean>) {
  await db.end();
}
