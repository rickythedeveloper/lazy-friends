import { z } from "zod";
interface GetRequest<T> {
    endpoint: string;
    responseSchema: z.ZodType<T>;
    accessToken?: string;
}
export declare function makeGetRequest<T>({ endpoint, responseSchema, accessToken, }: GetRequest<T>): Promise<T>;
interface PostRequest<T> {
    endpoint: string;
    body: object;
    responseSchema: z.ZodType<T>;
    accessToken?: string;
}
export declare function makePostRequest<T>({ endpoint, body, responseSchema, accessToken, }: PostRequest<T>): Promise<T>;
export {};
