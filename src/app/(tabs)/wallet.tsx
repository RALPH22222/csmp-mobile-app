import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Skeleton from "../../components/Skeleton";
import "../../global.css";
import { paymayaApi } from "../../api";

export default function WalletsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsBalanceVisible(false);
      setIsLoading(true);
      
      const fetchBalance = async () => {
        try {
          const res = await paymayaApi.getBalance();
          setBalance(res.balance);
        } catch (error) {
          console.error("Failed to fetch balance", error);
          setBalance(0);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBalance();
      
      return () => {};
    }, []),
  );

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 mb-6">
          <Text className="text-headline-lg font-bold text-on-surface">
            My Wallet
          </Text>
        </View>

        {/* Balance Card */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={["#004a52", "#008b98", "#00CADD", "#008b98", "#00535b"]}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 24,
              shadowColor: "#006D77",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            {isLoading ? (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </View>
                <Skeleton className="w-48 h-12" />
              </>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-white/80 text-label-lg font-medium">
                    Available Balance
                  </Text>
                  <Pressable
                    onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="active:opacity-70 p-2 -m-2"
                  >
                    <Ionicons
                      name={isBalanceVisible ? "eye" : "eye-off"}
                      size={20}
                      color="rgba(255,255,255,0.8)"
                    />
                  </Pressable>
                </View>
                <View className="flex-row items-center mb-2">
                  <Text className="text-white text-[40px] font-bold leading-[48px] tracking-[-0.02em]">
                    {isBalanceVisible ? `₱${(balance || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "••••••••"}
                  </Text>
                </View>
              </>
            )}
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between px-8 mb-8">
          {isLoading ? (
            <>
              <View className="items-center w-[30%]">
                <Skeleton className="w-14 h-14 rounded-full mb-2" />
                <Skeleton className="w-16 h-4" />
              </View>
              <View className="items-center w-[30%]">
                <Skeleton className="w-14 h-14 rounded-full mb-2" />
                <Skeleton className="w-16 h-4" />
              </View>
              <View className="items-center w-[30%]">
                <Skeleton className="w-14 h-14 rounded-full mb-2" />
                <Skeleton className="w-16 h-4" />
              </View>
            </>
          ) : (
            <>
              <ActionItem icon="arrow-down" label="Top Up" onPress={() => router.push("/pages/cash-in")} />
              <ActionItem icon="paper-plane" label="Transfer" />
              <ActionItem icon="cash-outline" label="Withdraw" />
            </>
          )}
        </View>

        {/* Recent Transactions */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-headline-md font-bold text-on-surface">
              Recent Transactions
            </Text>
            <Pressable className="active:opacity-70">
              <Text className="text-primary font-semibold">View All</Text>
            </Pressable>
          </View>

          <View className="bg-white rounded-[24px] p-2 border border-gray-100">
            {isLoading ? (
              [1, 2, 3, 4].map((i, index) => (
                <View key={i} className={`flex-row items-center justify-between p-4 ${index !== 3 ? "border-b border-gray-50" : ""}`}>
                  <View className="flex-row items-center flex-1 pr-4">
                    <Skeleton className="w-12 h-12 rounded-full mr-4" />
                    <View className="flex-1">
                      <Skeleton className="w-32 h-5 mb-1" />
                      <Skeleton className="w-24 h-4" />
                    </View>
                  </View>
                  <Skeleton className="w-16 h-5" />
                </View>
              ))
            ) : (
              <View className="p-8 items-center justify-center">
                <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                <Text className="text-body-lg text-on-surface-variant mt-4 text-center">
                  No recent transactions
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionItem({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) {
  return (
    <Pressable className="items-center active:opacity-70 w-[30%]" onPress={onPress}>
      <View className="w-14 h-14 bg-white rounded-full items-center justify-center mb-2 border border-gray-100 shadow-sm">
        <Ionicons name={icon as any} size={24} color="#00535b" />
      </View>
      <Text className="text-label-sm font-semibold text-on-surface-variant text-center">
        {label}
      </Text>
    </Pressable>
  );
}
