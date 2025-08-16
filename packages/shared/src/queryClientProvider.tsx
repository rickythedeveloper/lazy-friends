import type { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";

export function QueryClientProvider({
  children,
  client,
}: {
  children?: ReactNode;
  client: QueryClient;
}) {
  return (
    <TanStackQueryClientProvider client={client}>
      {children}
    </TanStackQueryClientProvider>
  );
}
