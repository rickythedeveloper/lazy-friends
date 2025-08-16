interface CreateGroupParams {
    title: string;
}
export declare function useCreateGroupMutation({ accessToken, }: {
    accessToken: string;
}): import("@tanstack/react-query").UseMutationResult<{
    id: string;
}, Error, CreateGroupParams, unknown>;
export {};
