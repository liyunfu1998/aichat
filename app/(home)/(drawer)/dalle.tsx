import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack } from "expo-router";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  LayoutChangeEvent,
} from "react-native";
import HeaderDropDown from "@/components/HeaderDropDown";
import { useEffect, useState } from "react";
import MessageInput from "@/components/MessageInput";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";
import { Role } from "@/utils/Interfaces";
import { useMMKVString } from "react-native-mmkv";
import { keyStorage, storage } from "@/utils/Storage";
import { GenerateImageGPTs } from "@/constants/GPTs";
import Colors from "@/constants/Colors";

const siliconFlowUrl = "https://api.siliconflow.cn/v1/images/generations";
export default function Dalle() {
  const [height, setHeight] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [key, setKey] = useMMKVString("apikey", keyStorage);
  const [working, setWorking] = useState(false);
  const [gptVersion, setGptVersion] = useMMKVString(
    "generateImageGPT",
    storage
  );

  if (!key || key === "") {
    return <Redirect href={"/(home)/(modal)/settings"} />;
  }

  const getCompletion = async (text: string) => {
    setWorking(true);
    setMessages([...messages, { role: Role.User, content: text }]);

    const response = await fetch(siliconFlowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: gptVersion || "stabilityai/stable-diffusion-3-5-large",
        prompt: text,
      }),
    });

    const result = await response.json();
    if (result.data && result.data.length > 0) {
      const imageUrl = result.data[0].url;
      setMessages((prev) => [
        ...prev,
        { role: Role.Bot, content: "", imageUrl, prompt: text },
      ]);
    }
    setWorking(false);
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
              items={GenerateImageGPTs}
            />
          ),
        }}
      />
      <View style={styles.page} onLayout={onLayout}>
        {messages.length == 0 && (
          <View
            style={[
              { marginTop: height / 2 - 100, alignItems: "center", gap: 16 },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.label}>让想象力变成图像</Text>
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            <>
              {working && (
                <ChatMessage
                  {...{ role: Role.Bot, content: "", loading: true }}
                />
              )}
            </>
          }
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      >
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
    width: 80,
    height: 80,
    backgroundColor: "#000",
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.greyLight,
  },
  image: {
    resizeMode: "cover",
  },
  page: {
    flex: 1,
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});
