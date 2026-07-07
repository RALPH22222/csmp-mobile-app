import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import "../../global.css";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profilePic } = useAuth();

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <LinearGradient
        colors={['#006D77', '#00CADD']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 280,
          paddingTop: insets.top + 24,
          paddingHorizontal: 24,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Link href="/profile" asChild>
              <Pressable className="w-12 h-12 bg-white rounded-full items-center justify-center overflow-hidden active:opacity-80">
                {profilePic ? (
                  <Image source={{ uri: profilePic }} className="w-full h-full" />
                ) : (
                  <Ionicons name="person" size={24} color="#006D77" />
                )}
              </Pressable>
            </Link>
            <Text className="text-white text-headline-md font-bold">
              Hello, Louise Klyde!
            </Text>
          </View>
          <Ionicons name="notifications" size={24} color="white" />
        </View>
      </LinearGradient>

      <View className="flex-1 bg-white rounded-t-[32px] -mt-12 px-6">
        <View
          className="bg-white rounded-[24px] p-6 -mt-16 mb-6 border border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Text className="text-label-lg font-bold text-on-surface-variant mb-2">
            Total Balance
          </Text>
          <Text className="text-[40px] font-bold text-on-surface leading-[48px] tracking-[-0.02em]">
            ₱ 2,500.00
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Action Buttons */}
          <View className="flex-row justify-between mb-8 px-6 py-4 bg-white rounded-[24px] border border-gray-100 shadow-sm mx-1">
            <Pressable className="items-center active:opacity-70">
              <View className="w-12 h-12 bg-[#e0f7fa] rounded-full items-center justify-center mb-2">
                <Ionicons name="arrow-down" size={24} color="#006D77" />
              </View>
              <Text className="text-body-sm font-bold text-on-surface">Cash In</Text>
            </Pressable>
            
            <Pressable className="items-center active:opacity-70">
              <View className="w-12 h-12 bg-[#e0f7fa] rounded-full items-center justify-center mb-2">
                <Ionicons name="arrow-up" size={24} color="#006D77" />
              </View>
              <Text className="text-body-sm font-bold text-on-surface">Cash Out</Text>
            </Pressable>
            
            <Pressable className="items-center active:opacity-70">
              <View className="w-12 h-12 bg-[#e0f7fa] rounded-full items-center justify-center mb-2">
                <Ionicons name="qr-code" size={24} color="#006D77" />
              </View>
              <Text className="text-body-sm font-bold text-on-surface">Scan QR</Text>
            </Pressable>
          </View>
          
          {/* Placeholder for future content */}
        </ScrollView>
      </View>
    </View>
  );
}
