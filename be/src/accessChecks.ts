import { AuthorizationError } from "./server/errors.ts";

export async function validateAccessChecks(checks: Promise<boolean>[]) {
  const checkResults = await Promise.all(checks);

  if (checkResults.every((result) => result)) {
    return;
  } else {
    throw new AuthorizationError("Access denied.");
  }
}
