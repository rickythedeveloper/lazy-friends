import { z } from "zod";
import type { AuthContext } from "./authContext/AuthContext.ts";
import type { DbClient } from "./db/dbService.ts";
import { createGroup } from "./entities/groups/operations.ts";

interface PostEndpointDefinition<T, U, V, W, Authenticated extends boolean> {
  requestBodySchema: z.ZodType<V>;
  responseBodySchema: z.ZodType<W>;
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
  responseBodySchema: z.ZodType<V>;
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

export const apiDefinition: ApiShape = {
  "/groups": {
    get: undefined,
    post: {
      requiresAuth: true,
      requestBodySchema: z.object({ title: z.string() }),
      responseBodySchema: z.object({ id: z.string() }),
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
      responseBodySchema: z.string(),
      handler: () => {
        return Promise.resolve("v1.0.0");
      },
    } satisfies GetEndpointDefinition<unknown, unknown, string, false>,
    post: undefined,
  },
} as const;
