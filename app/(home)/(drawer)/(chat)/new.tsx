import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack } from "expo-router";
import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  LayoutChangeEvent,
} from "react-native";
import HeaderDropDown from "@/components/HeaderDropDown";
import { useState } from "react";
import MessageInput from "@/components/MessageInput";
import { useAuth } from "@clerk/clerk-expo";
import MessageIdeas from "@/components/MessageIdeas";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";
import { Role } from "@/utils/Interfaces";
import { useMMKVString } from "react-native-mmkv";
import { keyStorage, storage } from "@/utils/Storage";

// URL：https://api.siliconflow.cn/v1
const MockMessages = [
  {
    role: Role.Bot,
    content: "Hello, how can I help you today?",
  },
  {
    role: Role.User,
    content:
      "I want to learn about the stock market I want to learn about the stock marketI want to learn about the stock marketI want to learn about the stock marketI want to learn about the stock market",
  },
];
export default function New() {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [height, setHeight] = useState(0);

  const [key, setKey] = useMMKVString("apikey", keyStorage);
  const [organization, setOrganization] = useMMKVString("org", keyStorage);

  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", storage);

  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href={"/(home)/(modal)/settings"} />;
  }
  const getCompletion = async (text: string) => {
    setMessages([...messages, text]);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height / 2);
  };
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
      <View style={styles.page} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.image}
            />
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{
            paddingBottom: 150,
            paddingTop: 30,
          }}
          keyboardDismissMode="on-drag"
        />
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {messages?.length === 0 && (
          <MessageIdeas onSelectCard={getCompletion} />
        )}
        <MessageInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 50,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  page: {
    flex: 1,
  },
});
