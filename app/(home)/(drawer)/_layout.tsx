import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  Text,
  Keyboard,
  Alert,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import { Link, useNavigation, useRouter } from "expo-router";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerStatus,
  DrawerItem,
} from "@react-navigation/drawer";
import { useUser } from "@clerk/clerk-expo";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Chat } from "@/utils/Interfaces";
import { getChats, renameChat } from "@/utils/Database";
import * as ContextMenu from "zeego/context-menu";
export const CustomDrawerContent = (props: any) => {
  const { bottom, top } = useSafeAreaInsets();
  const { user } = useUser();
  const db = useSQLiteContext();
  const isDrawerOpen = useDrawerStatus();
  const [history, setHistory] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadChats();
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  const loadChats = async () => {
    const result = (await getChats(db)) as Chat[];
    setHistory(result);
  };

  const onDeleteChat = (chatId: number) => {
    Alert.alert("Delete Chat", "Are you sure you want to delete this chat?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          // Delete the chat
          await db.runAsync("DELETE FROM chats WHERE id = ?", chatId);
          loadChats();
        },
      },
    ]);
  };
  const onRenameChat = (chatId: number) => {
    Alert.prompt(
      "Rename Chat",
      "Enter a new name for the chat",
      async (newName) => {
        if (newName) {
          // Rename the chat
          await renameChat(db, chatId, newName);
          loadChats();
        }
      }
    );
  };
  return (
    <View style={{ flex: 1, marginTop: top }}>
      <View style={{ backgroundColor: "#fff", paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.greyLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            underlineColorAndroid={"transparent"}
          />
        </View>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
        {history.map((chat) => (
          <ContextMenu.Root key={chat.id}>
            <ContextMenu.Trigger>
              <DrawerItem
                label={chat.title}
                onPress={() =>
                  router.push(`/(home)/(drawer)/(chat)/${chat.id}`)
                }
                inactiveTintColor="#000"
              />
            </ContextMenu.Trigger>
            <ContextMenu.Content
              loop
              alignOffset={10}
              avoidCollisions
              collisionPadding={10}
            >
              <ContextMenu.Preview>
                {() => (
                  <View
                    style={{
                      padding: 16,
                      height: 200,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text>{chat.title}</Text>
                  </View>
                )}
              </ContextMenu.Preview>

              <ContextMenu.Item
                key={"rename"}
                onSelect={() => onRenameChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: "pencil",
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
              <ContextMenu.Item
                key={"delete"}
                onSelect={() => onDeleteChat(chat.id)}
                destructive
              >
                <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: "trash",
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      </DrawerContentScrollView>
      <View style={{ padding: 16, paddingBottom: bottom }}>
        <Link href="/(home)/(modal)/settings" asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={{
                uri: user?.imageUrl,
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>
              {user?.emailAddresses[0].emailAddress}
            </Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};
export default function Layout() {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: Colors.light,
        },
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#000",
        drawerItemStyle: {
          borderRadius: 12,
        },
        drawerLabelStyle: {
          marginLeft: -20,
        },
        overlayColor: "rgba(0,0,0,0.2)",
        drawerStyle: {
          width: dimensions.width * 0.86,
        },
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        getId={() => Math.random().toString()}
        options={{
          title: "对话",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.btnImage}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(home)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="(chat)/[id]"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerRight: () => (
            <Link href={"/(home)/(drawer)/(chat)/new"} push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="dalle"
        getId={() => Math.random().toString()}
        options={{
          title: "生图",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.dallEImage}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        getId={() => Math.random().toString()}
        options={{
          title: "Explore GPTs",
          drawerIcon: () => (
            <View style={[styles.itemExplore]}>
              <Ionicons name="apps-outline" size={18} color={"#000"} />
            </View>
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 15,
    overflow: "hidden",
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  dallEImage: {
    width: 28,
    height: 28,
    resizeMode: "cover",
  },
  itemExplore: {
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  searchSection: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.input,
    borderRadius: 10,
    height: 34,
  },
  searchIcon: {
    padding: 6,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: "center",
    color: "#424242",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});
