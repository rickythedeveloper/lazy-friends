import type { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
export declare function QueryClientProvider({ children, client, }: {
    children?: ReactNode;
    client: QueryClient;
}): import("react/jsx-runtime").JSX.Element;
