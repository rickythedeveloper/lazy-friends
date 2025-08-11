import express, { type Request } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { createGroup } from "./entities/groups/operations.ts";
import {
  type AuthContext,
  getAuthContextOrThrow,
} from "./authContext/AuthContext.ts";
import { getDbClient } from "./db/connection.ts";
import { z } from "zod";
import type { DbClient } from "./db/dbService.ts";

const app = express();
const port = 3001;

const checkJwt = auth({
  audience: "lazy-friends.ricky-kawagishi.com",
  issuerBaseURL: "https://dev-cx465djnl0dls2wi.uk.auth0.com/",
});

interface PostEndpointDefinition<T, U, V, W, Authenticated extends boolean> {
  validateRequestBody: (body: unknown) => V;
  requiresAuth: Authenticated;
  handler: (
    request: {
      pathParams: T;
      queryParams: U;
      requestBody: V;
    },
    dependencies: Dependencies<Authenticated>,
  ) => Promise<W>;
}

interface GetEndpointDefinition<T, U, V, Authenticated extends boolean> {
  requiresAuth: Authenticated;
  handler: (
    request: { pathParams: T; queryParams: U },
    dependencies: Dependencies<Authenticated>,
  ) => Promise<V>;
}

type ApiShape = {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: GetEndpointDefinition<any, any, any, boolean> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: PostEndpointDefinition<any, any, any, any, boolean> | undefined;
  };
};

interface Dependencies<Authenticated extends boolean> {
  authContext: Authenticated extends true ? AuthContext : undefined;
  db: DbClient;
}

const apiDefinition: ApiShape = {
  "/groups": {
    get: undefined,
    post: {
      requiresAuth: true,
      validateRequestBody: (body) => {
        return z.object({ title: z.string() }).parse(body);
      },
      handler: async ({ requestBody }, { db, authContext }) => {
        return await createGroup({
          group: { title: requestBody.title },
          db,
          authContext,
        });
      },
    } satisfies PostEndpointDefinition<
      unknown,
      unknown,
      { title: string },
      { id: string },
      true
    >,
  },
  "/version": {
    get: {
      requiresAuth: false,
      handler: () => {
        return Promise.resolve("v1.0.0");
      },
    } satisfies GetEndpointDefinition<unknown, unknown, string, false>,
    post: undefined,
  },
};

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

Object.entries(apiDefinition).forEach(([path, methods]) => {
  if (methods.get) {
    const { handler, requiresAuth } = methods.get;
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
        res.json(responseBody);
      },
    );
  }

  if (methods.post) {
    const { handler, requiresAuth, validateRequestBody } = methods.post;
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
        const requestBody = validateRequestBody(req.body);
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
        res.json(responseBody);
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
