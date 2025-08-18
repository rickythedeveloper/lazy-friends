import { z } from "zod";
import type { AuthContext } from "./authContext/AuthContext.ts";
import type { DbClient } from "./db/dbService.ts";
import { createGroup, getGroups } from "./entities/groups/operations.ts";

interface PostEndpointDefinition<T, U, V, W, Authenticated extends boolean> {
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

export const apiSchema = {
  "/groups": {
    get: {
      responseSchema: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
        }),
      ),
    },
    post: {
      requestSchema: z.object({ title: z.string() }),
      responseSchema: z.object({ id: z.string() }),
    },
  },
  "/version": {
    get: {
      responseSchema: z.string(),
    },
    post: undefined,
  },
} satisfies {
  [key: string]: {
    get:
      | {
          responseSchema: z.ZodType;
        }
      | undefined;
    post:
      | {
          requestSchema: z.ZodType;
          responseSchema: z.ZodType;
        }
      | undefined;
  };
};

type ApiShape = {
  [key in keyof typeof apiSchema]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: GetEndpointDefinition<any, any, any, boolean> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: PostEndpointDefinition<any, any, any, any, boolean> | undefined;
  };
};

export interface Dependencies<Authenticated extends boolean> {
  authContext: Authenticated extends true ? AuthContext : undefined;
  db: DbClient;
}

export const apiDefinition: ApiShape = {
  "/groups": {
    get: {
      requiresAuth: true,
      handler: (_, { db, authContext }) => {
        return getGroups({ db, authContext });
      },
    } satisfies GetEndpointDefinition<
      unknown,
      unknown,
      z.infer<(typeof apiSchema)["/groups"]["get"]["responseSchema"]>,
      true
    >,
    post: {
      requiresAuth: true,
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
      z.infer<(typeof apiSchema)["/groups"]["post"]["requestSchema"]>,
      z.infer<(typeof apiSchema)["/groups"]["post"]["responseSchema"]>,
      true
    >,
  },
  "/version": {
    get: {
      requiresAuth: false,
      handler: () => {
        return Promise.resolve("v1.0.0");
      },
    } satisfies GetEndpointDefinition<
      unknown,
      unknown,
      z.infer<(typeof apiSchema)["/version"]["get"]["responseSchema"]>,
      false
    >,
    post: undefined,
  },
} as const;
