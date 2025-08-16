import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makePostRequest } from "../requests";
import { z } from "zod";
import { queryKeys } from "../queries/queryKeys";

interface CreateGroupParams {
  title: string;
}

export function useCreateGroupMutation({
  accessToken,
}: {
  accessToken: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: CreateGroupParams) =>
      makePostRequest({
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
