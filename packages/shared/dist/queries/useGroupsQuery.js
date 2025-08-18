import { useQuery } from "@tanstack/react-query";
import { makeGetRequest } from "../requests";
import { z } from "zod";
import { queryKeys } from "./queryKeys";
const groupSchema = z.object({
    id: z.string(),
    title: z.string(),
});
export function useGroupsQuery({ accessToken }) {
    return useQuery({
        queryKey: queryKeys.groups,
        queryFn: () => makeGetRequest({
            endpoint: "groups",
            responseSchema: z.array(groupSchema),
            accessToken,
        }),
        enabled: !!accessToken,
    });
}
