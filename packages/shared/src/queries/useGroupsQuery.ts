import { useQuery } from "@tanstack/react-query";
import { makeGetRequest } from "../requests";
import { z } from "zod";
import { queryKeys } from "./queryKeys";

export function useGroupsQuery({ accessToken }: { accessToken: string }) {
  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: () =>
      makeGetRequest({
        endpoint: "groups",
        responseSchema: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
          }),
        ),
        accessToken,
      }),
  });
}
