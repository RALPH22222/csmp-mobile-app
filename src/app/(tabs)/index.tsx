import React, { useState, useCallback } from "react";
import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "../../components/Skeleton";
import "../../global.css";

const MOCK_RECENT = [
  { id: '1', title: 'Top Up via Bank Transfer', date: 'Jul 9, 10:30 AM', amount: '+₱5,000.00', type: 'in', icon: 'card', color: '#006D77' },
  { id: '2', title: 'Coffee Shop Payment', date: 'Jul 9, 08:15 AM', amount: '-₱150.00', type: 'out', icon: 'cafe', color: '#E53E3E' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profilePic } = useAuth();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsBalanceVisible(false);
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }, [])
  );

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
            <View>
              <Text className="text-white text-headline-md font-bold">
                Hello, {user?.first_name || 'Louise'}!
              </Text>
              <View className="flex-row items-center mt-1 bg-white/20 px-2.5 py-1 rounded-full self-start">
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text className="text-white text-[12px] font-bold ml-1.5">Score: {user?.did_credit_score || 0}</Text>
              </View>
            </View>
          </View>
          <Ionicons name="notifications" size={24} color="white" />
        </View>
      </LinearGradient>

      <View className="flex-1 bg-[#fbf9f8] rounded-t-[32px] -mt-12 px-6">
        {/* Total Balance Card */}
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
          {isLoading ? (
            <>
              <View className="flex-row items-center justify-between mb-2">
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </View>
              <Skeleton className="w-48 h-12" />
            </>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-label-lg font-bold text-on-surface-variant">
                  Total Balance
                </Text>
                <Pressable 
                  onPress={() => setIsBalanceVisible(!isBalanceVisible)} 
                  className="active:opacity-70 p-2 -m-2"
                >
                  <Ionicons name={isBalanceVisible ? "eye" : "eye-off"} size={20} color="#6f797a" />
                </Pressable>
              </View>
              <Text className="text-[40px] font-bold text-on-surface leading-[48px] tracking-[-0.02em]">
                {isBalanceVisible ? '₱2,500.00' : '••••••••'}
              </Text>
            </>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Action Buttons */}
          <View className="flex-row justify-between mb-8 px-6 py-4 bg-white rounded-[24px] border border-gray-100 shadow-sm mx-1">
            {isLoading ? (
              <>
                <View className="items-center w-[30%]">
                  <Skeleton className="w-12 h-12 rounded-full mb-2" />
                  <Skeleton className="w-16 h-4" />
                </View>
                <View className="items-center w-[30%]">
                  <Skeleton className="w-12 h-12 rounded-full mb-2" />
                  <Skeleton className="w-16 h-4" />
                </View>
                <View className="items-center w-[30%]">
                  <Skeleton className="w-12 h-12 rounded-full mb-2" />
                  <Skeleton className="w-16 h-4" />
                </View>
              </>
            ) : (
              <>
                <Pressable className="items-center active:opacity-70 w-[30%]">
                  <View className="w-12 h-12 bg-[#e0f7fa] rounded-full items-center justify-center mb-2">
                    <Ionicons name="arrow-down" size={24} color="#006D77" />
                  </View>
                  <Text className="text-body-sm font-bold text-on-surface text-center">Cash In</Text>
                </Pressable>
                
                <Pressable className="items-center active:opacity-70 w-[30%]">
                  <View className="w-12 h-12 bg-[#e0f7fa] rounded-full items-center justify-center mb-2">
                    <Ionicons name="paper-plane" size={24} color="#006D77" />
                  </View>
                  <Text className="text-body-sm font-bold text-on-surface text-center">Transfer</Text>
                </Pressable>
                
                <Pressable className="items-center active:opacity-70 w-[30%]">
                  <View className="w-12 h-12 bg-[#e0f7fa] rounded-full items-center justify-center mb-2">
                    <Ionicons name="cash-outline" size={24} color="#006D77" />
                  </View>
                  <Text className="text-body-sm font-bold text-on-surface text-center">Withdraw</Text>
                </Pressable>
              </>
            )}
          </View>
          

          {/* Recent Activity */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-headline-md font-bold text-on-surface">Recent Activity</Text>
              <Link href="/history" asChild>
                <Pressable className="active:opacity-70">
                  <Text className="text-primary font-semibold">View All</Text>
                </Pressable>
              </Link>
            </View>
            
            <View className="bg-white rounded-[24px] p-2 border border-gray-100 mx-1 shadow-sm">
              {isLoading ? (
                [1, 2, 3].map((i, index) => (
                  <View key={i} className={`flex-row items-center justify-between p-4 ${index !== 2 ? 'border-b border-gray-50' : ''}`}>
                    <View className="flex-row items-center flex-1 pr-4">
                      <Skeleton className="w-12 h-12 rounded-full mr-4" />
                      <View className="flex-1">
                        <Skeleton className="w-32 h-5 mb-1" />
                        <Skeleton className="w-20 h-4" />
                      </View>
                    </View>
                    <Skeleton className="w-16 h-5" />
                  </View>
                ))
              ) : (
                MOCK_RECENT.map((tx, index) => (
                  <Pressable 
                    key={tx.id} 
                    className={`flex-row items-center justify-between p-4 active:opacity-70 ${index !== MOCK_RECENT.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <View className="flex-row items-center flex-1 pr-4">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center mr-4" 
                        style={{ backgroundColor: `${tx.color}15` }}
                      >
                        <Ionicons name={tx.icon as any} size={24} color={tx.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-body-lg font-bold text-on-surface" numberOfLines={1}>{tx.title}</Text>
                        <Text className="text-label-sm text-on-surface-variant mt-0.5">{tx.date}</Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text 
                        className="text-body-lg font-bold" 
                        style={{ color: tx.type === 'in' ? '#006D77' : '#1b1c1c' }}
                      >
                        {tx.amount}
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
}
