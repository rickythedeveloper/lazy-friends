import type { Request } from "express";

export interface AuthContext {
  userId: string;
}

export function getAuthContextOrThrow(req: Request): AuthContext {
  if (!req.auth) {
    throw new Error("No auth");
  }

  const sub = req.auth.payload.sub;

  if (!sub) {
    throw new Error("No sub");
  }

  return {
    userId: sub,
  };
}
