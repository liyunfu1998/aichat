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
import { useEffect, useRef, useState } from "react";
import MessageInput from "@/components/MessageInput";
import { useAuth } from "@clerk/clerk-expo";
import MessageIdeas from "@/components/MessageIdeas";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";
import { Role } from "@/utils/Interfaces";
import { useMMKVString } from "react-native-mmkv";
import { keyStorage, storage } from "@/utils/Storage";
import EventSource from "react-native-sse";
import { GPTs } from "@/constants/GPTs";

const siliconFlowUrl = "https://api.siliconflow.cn/v1/chat/completions";
export default function New() {
  const [messages, setMessages] = useState<any[]>([]);
  const [height, setHeight] = useState(0);
  const [key, setKey] = useMMKVString("apikey", keyStorage);

  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", storage);

  if (!key || key === "") {
    return <Redirect href={"/(home)/(modal)/settings"} />;
  }

  const getCompletion = async (message: string) => {
    if (messages.length === 0) {
      /// 稍后创建聊天，存储到数据库
    }
    const prevMessages = [...messages];
    setMessages([
      ...messages,
      {
        content: message,
        role: Role.User,
      },
      {
        content: "",
        role: Role.Bot,
      },
    ]);

    const es = new EventSource(siliconFlowUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: gptVersion || "deepseek-ai/DeepSeek-V2.5",
        messages: [...prevMessages, { role: "user", content: message }],
        max_tokens: 600,
        n: 1,
        temperature: 0.7,
        stream: true,
      }),
      pollingInterval: 0, // Remember to set pollingInterval to 0 to disable reconnections
    });

    es?.addEventListener("open", () => {
      console.log("SSE connection opened.");
    });

    es?.addEventListener("message", (event) => {
      if (event.data !== "[DONE]") {
        const data = JSON.parse(event?.data || "");

        if (data.choices[0].delta.content !== undefined) {
          if (messages.length > 0) {
            setMessages((prevMessages) => {
              prevMessages[prevMessages.length - 1].content +=
                data.choices[0].delta.content;
              return [...prevMessages];
            });
          } else {
            setMessages((prevMessages) => {
              if (prevMessages.length > 0) {
                prevMessages[prevMessages.length - 1].content +=
                  data.choices[0].delta.content;
              } else {
                prevMessages.push({
                  content: data.choices[0].delta.content,
                  role: Role.Bot,
                });
              }
              return [...prevMessages];
            });
          }
        }
      }
    });
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
              title={gptVersion! || "请选择大模型"}
              selected={gptVersion}
              onSelect={(key) => setGptVersion(key)}
              items={GPTs}
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
