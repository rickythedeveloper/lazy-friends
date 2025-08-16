import { Stack } from "expo-router";
import { QueryClient } from "@lf/shared";
import { View } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  // return <Stack/>
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
