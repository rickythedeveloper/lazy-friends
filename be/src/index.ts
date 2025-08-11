import express from "express";
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

interface EndpointDefinition<T, U, V, W> {
  validateRequestBody: (body: unknown) => V;
  requiresAuth: boolean;
  handler: (request: {
    pathParams: T;
    queryParams: U;
    requestBody: V;
  }) => Promise<W>;
}

type ApiShape = {
  [key: string]: {
    post: EndpointDefinition<any, any, any, any> | undefined;
    get: EndpointDefinition<any, any, any, any> | undefined;
  };
};

const apiDefinition: ApiShape = {
  groups: {
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
    } satisfies EndpointDefinition<
      unknown,
      unknown,
      { title: string },
      { id: string }
    >,
  },
  users: {
    get: {
      requiresAuth: false,
      validateRequestBody: () => {},
      handler: async () => {
        return Promise.resolve({ id: "heyo" });
      },
    } satisfies EndpointDefinition<unknown, unknown, unknown, { id: string }>,
    post: undefined,
  },
};

Object.entries(apiDefinition).forEach(([path, methods]) => {
  if (methods.get) {
    const { handler, validateRequestBody } = methods.get;
    app.post(path, checkJwt, async (req, res, next) => {
      const requestBody = validateRequestBody(req.body);
      const pathParams = req.params;
      const queryParams = req.query;
      const responseBody = await handler({
        pathParams,
        requestBody,
        queryParams,
      });
      res.json(responseBody);
    });
  }

  if (methods.post) {
    const { handler, validateRequestBody } = methods.post;
    app.post(path, checkJwt, async (req, res, next) => {
      const requestBody = validateRequestBody(req.body);
      const pathParams = req.params;
      const queryParams = req.query;
      const responseBody = await handler({
        pathParams,
        requestBody,
        queryParams,
      });
      res.json(responseBody);
    });
  }
});

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req, res) => {
  console.log("heyo");
  res.send("Hello World!");
});

app.get("/public", (req, res) => {
  console.log("heyo publid");
  res.send("Public endpoint");
});

app.get("/users", checkJwt, (req, res) => {
  console.log("heyo private");
  res.json("Private endpoint");
});

app.post("/groups", checkJwt, async (req, res) => {
  const authContext = getAuthContextOrThrow(req);
  const db = getDbConnection();

  const createdGroup = await createGroup({
    group: { title: "test groups" },
    authContext,
    db,
  });

  res.json(createdGroup);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`);
});
