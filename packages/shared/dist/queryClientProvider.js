import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider as TanStackQueryClientProvider, } from "@tanstack/react-query";
export function QueryClientProvider({ children, client, }) {
    return (_jsx(TanStackQueryClientProvider, { client: client, children: children }));
}
