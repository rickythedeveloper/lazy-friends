import express, { request } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { createGroup } from "./entities/groups/operations.ts";
import { getAuthContextOrThrow } from "./authContext/AuthContext.ts";
import { getDbConnection } from "./db/connection.ts";
import { z } from "zod";

const app = express();
const port = 3001;

const checkJwt = auth({
  audience: "lazy-friends.ricky-kawagishi.com",
  issuerBaseURL: "https://dev-cx465djnl0dls2wi.uk.auth0.com/",
});

interface PostEndpointDefinition<T, U, V, W> {
  validateRequestBody: (body: unknown) => V;
  requiresAuth: boolean;
  handler: (request: {
    pathParams: T;
    queryParams: U;
    requestBody: V;
  }) => Promise<W>;
}

interface GetEndpointDefinition<T, U, V> {
  requiresAuth: boolean;
  handler: (request: { pathParams: T; queryParams: U }) => Promise<V>;
}

type ApiShape = {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: GetEndpointDefinition<any, any, any> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: PostEndpointDefinition<any, any, any, any> | undefined;
  };
};

const apiDefinition: ApiShape = {
  "/groups": {
    get: undefined,
    post: {
      requiresAuth: true,
      validateRequestBody: (body) => {
        return z.object({ title: z.string() }).parse(body);
      },
      handler: async ({ requestBody }) => {
        console.log(requestBody);
        return Promise.resolve({ id: "heyo" });
      },
    } satisfies PostEndpointDefinition<
      unknown,
      unknown,
      { title: string },
      { id: string }
    >,
  },
  "/version": {
    get: {
      requiresAuth: false,
      handler: async () => {
        return Promise.resolve("v1.0.0");
      },
    } satisfies GetEndpointDefinition<unknown, unknown, string>,
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
        const pathParams = req.params;
        const queryParams = req.query;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = await handler({
          pathParams,
          queryParams,
        });
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
      async (req, res, next) => {
        const authContext = requiresAuth
          ? getAuthContextOrThrow(req)
          : undefined;
        const db = getDbConnection();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const requestBody = validateRequestBody(req.body);
        const pathParams = req.params;
        const queryParams = req.query;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = await handler({
          pathParams,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          requestBody,
          queryParams,
        });
        res.json(responseBody);
      },
    );
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`);
});
