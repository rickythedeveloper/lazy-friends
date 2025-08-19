import express, { type Request } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import {
  type AuthContext,
  getAuthContextOrThrow,
} from "./authContext/AuthContext.ts";
import { getDbClient } from "./db/connection.ts";
import type { DbClient } from "./db/dbService.ts";
import {
  apiDefinition,
  apiSchema,
  type Dependencies,
} from "./apiDefinition.ts";
import { cleanupDependencies } from "./serverUtils.ts";
import { errorHandler } from "./server/errorHandler.ts";
import { AuthBroker } from "./authBroker.ts";

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

app.use(express.json());

Object.entries(apiSchema).forEach(([path, method]) => {
  const path2 = path as keyof typeof apiSchema;

  if (!(path in apiDefinition)) {
    throw new Error(`Path ${path} not found in apiDefinition`);
  }

  const apiDefinitionForPath = apiDefinition[path2];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (method.get) {
    if (!apiDefinitionForPath.get) {
      throw new Error(`Method get not found for path ${path}`);
    }

    const { responseSchema } = method.get;
    const { handler, requiresAuth } = apiDefinitionForPath.get;
    app.get(
      path,
      requiresAuth
        ? checkJwt
        : (_, __, next) => {
            next();
          },
      async (req, res) => {
        const dependencies = requiresAuth
          ? getDependenciesWithAuth({ req })
          : getDependenciesWithoutAuth();

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
        res.json(responseSchema.parse(responseBody));

        await cleanupDependencies(dependencies);
      },
    );
  }

  if (method.post) {
    if (!apiDefinitionForPath.post) {
      throw new Error(`Method post not found for path ${path}`);
    }

    const { requestSchema, responseSchema } = method.post;
    const { handler, requiresAuth } = apiDefinitionForPath.post;
    app.post(
      path,
      requiresAuth
        ? checkJwt
        : (_, __, next) => {
            next();
          },
      async (req, res) => {
        const dependencies = requiresAuth
          ? getDependenciesWithAuth({ req })
          : getDependenciesWithoutAuth();

        const requestBody = requestSchema.parse(req.body);
        const pathParams = req.params;
        const queryParams = req.query;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = await handler(
          {
            pathParams,

            requestBody,
            queryParams,
          },
          dependencies,
        );
        res.json(responseSchema.parse(responseBody));

        await cleanupDependencies(dependencies);
      },
    );
  }
});

function getDependenciesWithoutAuth(): Dependencies<false> {
  return {
    authContext: undefined,
    db: getDbClient(),
    authBroker: new AuthBroker(),
  };
}

function getDependenciesWithAuth({
  req,
}: {
  req: Request;
}): Dependencies<true> {
  return {
    authContext: getAuthContextOrThrow(req),
    db: getDbClient(),
    authBroker: new AuthBroker(),
  };
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`);
});
