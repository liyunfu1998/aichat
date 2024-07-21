import { Button, Text, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export default function Page() {
  const { signOut } = useAuth();
  return (
    <View>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
