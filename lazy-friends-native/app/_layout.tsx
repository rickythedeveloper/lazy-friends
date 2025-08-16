import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@lf/shared";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
