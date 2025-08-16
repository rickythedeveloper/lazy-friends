import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makePostRequest } from "../requests";
import { z } from "zod";
import { queryKeys } from "../queries/queryKeys";
export function useCreateGroupMutation({ accessToken, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ title }) => makePostRequest({
            endpoint: "groups",
            body: { title },
            responseSchema: z.object({ id: z.uuid() }),
            accessToken,
        }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.groups });
        },
    });
}
