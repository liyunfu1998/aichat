import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { keyStorage } from "@/utils/Storage";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
const Page = () => {
  const [key, setKey] = useMMKVString("apikey", keyStorage);

  const [apiKey, setApiKey] = useState("");
  const router = useRouter();

  const { signOut } = useAuth();

  const saveApiKey = async () => {
    setKey(apiKey);
    router.navigate("/(home)/(drawer)");
  };

  const removeApiKey = async () => {
    setKey("");
  };

  return (
    <View style={styles.container}>
      {key && key !== "" && (
        <>
          <Text style={styles.label}>你已经设置好了！</Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>删除配置</Text>
          </TouchableOpacity>
        </>
      )}

      {(!key || key === "") && (
        <>
          <Text style={styles.label}>API Key:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="填写你的API Key"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={saveApiKey}
          >
            <Text style={styles.buttonText}>保存</Text>
          </TouchableOpacity>
        </>
      )}
      <Button title="退出登录" onPress={() => signOut()} color={Colors.grey} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
export default Page;
