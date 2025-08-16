import { z } from "zod";

const headers = {
  "Content-Type": "application/json",
};

interface GetRequest<T> {
  endpoint: string;
  responseSchema: z.ZodType<T>;
  accessToken?: string;
}

export async function makeGetRequest<T>({
  endpoint,
  responseSchema,
  accessToken,
}: GetRequest<T>) {
  console.log("heyoooo");
  const response = await fetch(`http://127.0.0.1:3001/${endpoint}`, {
    method: "GET",
    headers: {
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return responseSchema.parse(await response.json());
}

interface PostRequest<T> {
  endpoint: string;
  body: object;
  responseSchema: z.ZodType<T>;
  accessToken?: string;
}

export async function makePostRequest<T>({
  endpoint,
  body,
  responseSchema,
  accessToken,
}: PostRequest<T>): Promise<T> {
  const response = await fetch(`http://localhost:3001/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const responseBody = await response.json();

  return responseSchema.parse(responseBody);
}
