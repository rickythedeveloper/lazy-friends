import express, { type Request } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import {
  type AuthContext,
  getAuthContextOrThrow,
} from "./authContext/AuthContext.ts";
import { getDbClient } from "./db/connection.ts";
import type { DbClient } from "./db/dbService.ts";
import { apiDefinition } from "./apiDefinition.ts";

const app = express();
const port = 3001;

const checkJwt = auth({
  audience: "lazy-friends.ricky-kawagishi.com",
  issuerBaseURL: "https://dev-cx465djnl0dls2wi.uk.auth0.com/",
});

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

Object.entries(apiDefinition).forEach(([path, methods]) => {
  if (methods.get) {
    const { handler, requiresAuth, responseBodySchema } = methods.get;
    app.get(
      path,
      requiresAuth
        ? checkJwt
        : (_, __, next) => {
            next();
          },
      async (req, res) => {
        const dependencies = getDependencies({ req, requiresAuth });

        const pathParams = req.params;
        const queryParams = req.query;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = await handler(
          {
            pathParams,
            queryParams,
          },
          dependencies,
        );
        res.json(responseBodySchema.parse(responseBody));
      },
    );
  }

  if (methods.post) {
    const { handler, requiresAuth, requestBodySchema, responseBodySchema } =
      methods.post;
    app.post(
      path,
      requiresAuth
        ? checkJwt
        : (_, __, next) => {
            next();
          },
      async (req, res) => {
        const dependencies = getDependencies({ req, requiresAuth });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const requestBody = requestBodySchema.parse(req.body);
        const pathParams = req.params;
        const queryParams = req.query;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = await handler(
          {
            pathParams,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            requestBody,
            queryParams,
          },
          dependencies,
        );
        res.json(responseBodySchema.parse(responseBody));
      },
    );
  }
});

function getDependencies({
  req,
  requiresAuth,
}: {
  req: Request;
  requiresAuth: boolean;
}): { authContext: AuthContext | undefined; db: DbClient } {
  return {
    authContext: requiresAuth ? getAuthContextOrThrow(req) : undefined,
    db: getDbClient(),
  };
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`);
});
