import AnimatedIntro from "@/components/AnimatedIntro";
import BottomLoginSheet from "@/components/BottomLoginSheet";
import Profile from "@/components/Profile";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isSignedIn) {
      if (router.canGoBack()) {
        return;
      }
      timerRef.current = setTimeout(() => {
        router.replace("/(home)/(drawer)");
      }, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isSignedIn]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AnimatedIntro />
      {isSignedIn ? <Profile /> : <BottomLoginSheet />}
    </View>
  );
}
