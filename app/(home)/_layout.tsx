import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Layout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/settings"
        options={{
          headerTitle: "设置",
          presentation: "modal",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.selected,
          },
          headerRight: () => (
            <>
              {router.canGoBack() && (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    backgroundColor: Colors.greyLight,
                    borderRadius: 20,
                    padding: 4,
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={Colors.grey}
                  />
                </TouchableOpacity>
              )}
            </>
          ),
        }}
      />
    </Stack>
  );
}
