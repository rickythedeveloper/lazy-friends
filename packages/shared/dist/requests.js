import { z } from "zod";
const headers = {
    "Content-Type": "application/json",
};
export async function makeGetRequest({ endpoint, responseSchema, accessToken, }) {
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
export async function makePostRequest({ endpoint, body, responseSchema, accessToken, }) {
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
