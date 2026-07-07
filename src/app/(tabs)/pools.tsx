import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import "../../global.css";

import { MOCK_POOLS } from "../../constants/mockPools";

export default function PoolsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"my" | "public">("my");

  const filteredPools = MOCK_POOLS.filter((pool) => {
    const matchesTab = selectedTab === "public";
    const matchesSearch = pool.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white border-b border-[#f0f2f2]">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[22px] font-extrabold text-[#003840]">Pools</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-[#f0f2f2] items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="#003840" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-[#f0f2f2] rounded-full px-4 py-3">
          <Ionicons name="search" size={18} color="#6f797a" />
          <TextInput
            placeholder="Search pools..."
            placeholderTextColor="#9aa4a5"
            className="flex-1 ml-2 text-[15px]"
            style={{ color: "#003840", paddingVertical: 0 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#6f797a" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Body */}
      <View className="flex-1 bg-[#f7f9f9] pt-4">
        {/* Segmented Control */}
        <View className="flex-row mx-6 mb-4 p-1 rounded-[14px] bg-[#f0f2f2]">
          <TouchableOpacity
            onPress={() => setSelectedTab("my")}
            className="flex-1 items-center py-2.5 rounded-[10px]"
            style={{
              backgroundColor: selectedTab === "my" ? "#ffffff" : "transparent",
              elevation: selectedTab === "my" ? 2 : 0,
              shadowColor: "#000",
              shadowOpacity: selectedTab === "my" ? 0.06 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text
              className="text-[14px] font-bold"
              style={{ color: selectedTab === "my" ? "#006D77" : "#6f797a" }}
            >
              My Pools
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("public")}
            className="flex-1 items-center py-2.5 rounded-[10px]"
            style={{
              backgroundColor: selectedTab === "public" ? "#ffffff" : "transparent",
              elevation: selectedTab === "public" ? 2 : 0,
              shadowColor: "#000",
              shadowOpacity: selectedTab === "public" ? 0.06 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text
              className="text-[14px] font-bold"
              style={{ color: selectedTab === "public" ? "#006D77" : "#6f797a" }}
            >
              Public Pools
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pool List */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredPools.length === 0 ? (
            selectedTab === "my" ? (
              <View className="pt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full rounded-[20px] border-2 border-dashed border-[#006D77] items-center justify-center py-10"
                  style={{ backgroundColor: "rgba(0,109,119,0.03)" }}
                >
                  <View className="w-16 h-16 rounded-full bg-[#e0f7fa] items-center justify-center mb-4">
                    <MaterialCommunityIcons name="piggy-bank-outline" size={32} color="#006D77" />
                  </View>
                  <Text className="text-[16px] font-bold text-[#006D77] mb-1">Create a Pool</Text>
                  <Text className="text-[12px] text-[#6f797a] text-center px-8">
                    Start saving together with friends and family
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center justify-center py-20 opacity-50">
                <Ionicons name="search-outline" size={48} color="#6f797a" />
                <Text className="text-[15px] text-[#6f797a] mt-2.5">No pools found.</Text>
              </View>
            )
          ) : (
            filteredPools.map((pool) => (
              <TouchableOpacity
                key={pool.id}
                onPress={() => router.push(`/pages/pool/${pool.id}` as any)}
                activeOpacity={0.8}
                className="bg-white rounded-[20px] p-[18px] mb-3.5 border border-[#f0f2f2]"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.07,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 3,
                }}
              >
                {/* Card Header */}
                <View className="flex-row justify-between items-start mb-3.5">
                  <View className="flex-row items-center flex-1 pr-2">
                    <View className="w-12 h-12 rounded-[14px] bg-[#e0f7fa] items-center justify-center mr-3">
                      <MaterialCommunityIcons name="piggy-bank" size={26} color="#006D77" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[15px] font-bold text-[#191c1d]" numberOfLines={1}>
                        {pool.title}
                      </Text>
                      <Text className="text-[12px] text-[#6f797a] mt-0.5">
                        {pool.totalMembers} Members
                      </Text>
                    </View>
                  </View>
                  <View
                    className="px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: pool.status === "Active" ? "#e0f7fa" : "#f0f2f2" }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: pool.status === "Active" ? "#006D77" : "#6f797a" }}
                    >
                      {pool.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Card Footer */}
                <View className="flex-row justify-between items-center rounded-[12px] p-3 border border-[#e0f7fa] bg-[#f7fbfb]">
                  <View>
                    <Text className="text-[11px] text-[#6f797a] mb-0.5">Pool Amount</Text>
                    <Text className="text-[16px] font-extrabold text-[#006D77]">
                      ₱{pool.totalAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View className="w-px self-stretch bg-[#d0edf0] mx-2" />
                  <View className="items-end">
                    <Text className="text-[11px] text-[#6f797a] mb-0.5">Your Share</Text>
                    <Text className="text-[16px] font-bold text-[#191c1d]">
                      ₱{pool.contributionPerWeek.toLocaleString()}/wk
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
