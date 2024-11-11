import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import HeaderDropDown from "@/components/HeaderDropDown";
import { useState } from "react";
export default function New() {
  const [gptVersion, setGptVersion] = useState("3.5");
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title={gptVersion === "3.5" ? "ChatGPT 3.5" : "ChatGPT 4"}
              selected={gptVersion}
              onSelect={(key) => setGptVersion(key)}
              items={[
                { key: "3.5", title: "ChatGPT 3.5", icon: "bolt" },
                { key: "4", title: "ChatGPT 4", icon: "sparkles" },
              ]}
            />
          ),
        }}
      />
      <Text>New</Text>
    </View>
  );
}
