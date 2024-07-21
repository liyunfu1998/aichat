import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function BottomLoginSheet() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="w-full absolute bottom-0 bg-black  rounded-tl-[20px] rounded-tr-[20px] p-[26px] gap-y-4"
      style={[{ paddingBottom: bottom }]}
    >
      <TouchableOpacity className="bg-white" style={[defaultStyles.btn]}>
        <Ionicons name="logo-apple" className="pr-1.5" size={14} />
        <Text className="text-black text-xl">Continue with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-zinc-800" style={[defaultStyles.btn]}>
        <Ionicons name="logo-google" size={16} className="pr-1.5" color={'#fff'} />
        <Text className="text-white text-[20px]">Continue with Google</Text>
      </TouchableOpacity>
      <Link
        href={{
          pathname: '/login',
          params: { type: 'register' },
        }}
        className="bg-zinc-800"
        style={[defaultStyles.btn]}
        asChild
      >
        <TouchableOpacity>
          <Ionicons name="mail" size={20} className="pr-1.5" color={'#fff'} />
          <Text className="text-white text-[20px]">Sign up with email</Text>
        </TouchableOpacity>
      </Link>
      <Link
        href={{
          pathname: '/login',
          params: { type: 'login' },
        }}
        className="border-[3px] border-gray-500"
        style={[defaultStyles.btn]}
        asChild
      >
        <TouchableOpacity>
          <Text className="text-white text-[20px]">Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
