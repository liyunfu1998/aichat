import { useUser } from "@clerk/clerk-expo";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Profile() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
      <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
