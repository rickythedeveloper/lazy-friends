import type { ErrorRequestHandler } from "express";
import { AuthorizationError, DbError } from "./errors.ts";

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  }

  if (err instanceof AuthorizationError) {
    res.status(401).send(err.message);
    next();
    return;
  }

  if (err instanceof DbError) {
    res.status(400).send(err.message);
    next();
    return;
  }
};
