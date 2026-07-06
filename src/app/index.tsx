import { Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import "../global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-headline-lg font-bold text-primary mb-md text-center">
        CSMP Paluwagan
      </Text>
      <Link href="/pages/auth/login" asChild>
        <Pressable className="bg-primary px-lg py-sm rounded-xl">
          <Text className="text-on-primary text-label-lg font-bold">
            Go to Login
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}