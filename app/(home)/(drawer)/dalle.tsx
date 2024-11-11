import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import HeaderDropDown from "@/components/HeaderDropDown";
import { useState } from "react";
export default function Page() {
  const [selected, setSelected] = useState("share");
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title={
                selected === "share"
                  ? "Share GPT"
                  : selected === "details"
                  ? "See Details"
                  : "Keep in Sidebar"
              }
              selected={selected}
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "square.and.arrow.up",
                },
                { key: "details", title: "See Details", icon: "info.circle" },
                { key: "keep", title: "Keep in Sidebar", icon: "pin" },
              ]}
              onSelect={(key) => setSelected(key)}
            />
          ),
        }}
      />
      <Text>New</Text>
    </View>
  );
}
