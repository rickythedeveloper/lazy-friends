import type {ReactNode} from "react";

export {useQuery} from '@tanstack/react-query'
import {QueryClientProvider as TanStackQueryClientProvider, QueryClient} from '@tanstack/react-query'

const queryClient = new QueryClient()

export function QueryClientProvider({children}: {children: ReactNode}) {
    return (
        <TanStackQueryClientProvider client={queryClient}>
            {children}
        </TanStackQueryClientProvider>
    )
}