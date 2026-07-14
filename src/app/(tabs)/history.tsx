import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, SectionList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { transactionApi } from "../../api";
import "../../global.css";

const FILTERS = ["All", "Pools", "Wallet"];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [rawHistoryData, setRawHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchHistory = async () => {
        try {
          setIsLoading(true);
          const response = await transactionApi.getHistory();
          if (isActive && response.data) {
            setRawHistoryData(response.data);
          }
        } catch (error) {
          console.error("Error fetching history:", error);
          if (isActive) setRawHistoryData([]);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };
      
      fetchHistory();
      return () => { isActive = false; };
    }, [])
  );

  React.useEffect(() => {
    // Filter the raw data
    const filteredData = rawHistoryData.filter((item: any) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Pools") return true; // Since we currently only have pool transactions fetched
      if (activeFilter === "Wallet") return false; // Placeholder for wallet transactions
      return true;
    });

    // Group by rawDate string (YYYY-MM-DD)
    const grouped = filteredData.reduce((acc: any, curr: any) => {
      const d = new Date(curr.rawDate);
      const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(curr);
      return acc;
    }, {});
    
    const sections = Object.keys(grouped).map(dateStr => {
      // Convert to "Today", "Yesterday", or format date
      const [year, month, day] = dateStr.split('-');
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const today = new Date();
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      
      let title = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Normalize today for comparison
      const todayNorm = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (dateObj.getTime() === todayNorm.getTime()) title = "Today";
      else if (dateObj.getTime() === yesterday.getTime()) title = "Yesterday";
      
      return {
        title,
        rawDate: dateObj,
        data: grouped[dateStr]
      };
    }).sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    
    setHistoryData(sections);
  }, [rawHistoryData, activeFilter]);

  return (
    <View className="flex-1 bg-[#fbf9f8]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
        <Text className="text-headline-lg font-bold text-on-surface">History</Text>
        <Pressable className="w-10 h-10 rounded-full bg-white items-center justify-center border border-gray-100 shadow-sm active:opacity-70">
          <Ionicons name="search" size={20} color="#006D77" />
        </Pressable>
      </View>

      {/* Segmented Control */}
      <View className="flex-row mx-6 mb-4 p-1 rounded-[14px] bg-[#f0f2f2]">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className="flex-1 items-center py-2.5 rounded-[10px]"
              style={{
                backgroundColor: isActive ? "#ffffff" : "transparent",
                elevation: isActive ? 2 : 0,
                shadowColor: "#000",
                shadowOpacity: isActive ? 0.06 : 0,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Text
                className="text-[14px] font-bold"
                style={{
                  color: isActive ? "#003840" : "#6f797a",
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color="#006D77" />
        </View>
      ) : historyData.length === 0 ? (
        <View className="flex-1 items-center justify-center pt-20">
          <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
          <Text className="text-body-lg text-on-surface-variant mt-4 text-center">
            No history found
          </Text>
        </View>
      ) : (
        <SectionList
          sections={historyData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-label-lg font-bold text-on-surface-variant mt-6 mb-3">
              {title}
            </Text>
          )}
          renderItem={({ item, index, section }) => {
            const isLast = index === section.data.length - 1;
            
            return (
              <View 
                className={`bg-white px-4 py-4 ${
                  index === 0 ? 'rounded-t-[20px]' : ''
                } ${
                  isLast ? 'rounded-b-[20px] mb-2' : 'border-b border-gray-50'
                }`}
              >
                <Pressable className="flex-row items-center justify-between active:opacity-70">
                  <View className="flex-row items-center flex-1 pr-4">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-4" 
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[16px] font-bold text-on-surface" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text 
                        className="text-[14px] font-bold mt-1" 
                        style={{ color: item.color }}
                      >
                        {item.amount}
                      </Text>
                      <Text className="text-[12px] text-on-surface-variant font-medium mt-0.5">
                        {item.time}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
