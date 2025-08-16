export declare function useGroupsQuery({ accessToken }: {
    accessToken: string;
}): import("@tanstack/react-query").UseQueryResult<{
    id: string;
    title: string;
}[], Error>;
