import { Text, View } from "react-native";
import { useQuery } from "@lf/shared";
import { useEffect } from "react";

export default function Index() {
  const { data } = useQuery({
    queryFn: async () => await fetch("https://httpbin.org/get"),
    queryKey: ["public"],
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
