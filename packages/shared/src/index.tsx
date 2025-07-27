'use client'

import type {ReactNode} from "react";

export {useQuery, QueryClient} from '@tanstack/react-query'
import {QueryClientProvider as TanStackQueryClientProvider, QueryClient} from '@tanstack/react-query'

export function QueryClientProvider({children, client}: {children?: ReactNode, client: QueryClient}) {
    return (
        <TanStackQueryClientProvider client={client}>
            {children}
        </TanStackQueryClientProvider>
    )
}