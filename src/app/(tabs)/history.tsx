import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, SectionList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";

const FILTERS = ["All", "Cash In", "Cash Out", "Transfers", "Bills"];

const MOCK_HISTORY = [
  {
    title: "Today",
    data: [
      { id: '1', title: 'Top Up via Bank Transfer', time: '10:30 AM', amount: '+₱5,000.00', type: 'in', icon: 'card', color: '#006D77' },
      { id: '2', title: 'Coffee Shop Payment', time: '08:15 AM', amount: '-₱150.00', type: 'out', icon: 'cafe', color: '#E53E3E' },
    ]
  },
  {
    title: "Yesterday",
    data: [
      { id: '3', title: 'Transfer to John Doe', time: '3:15 PM', amount: '-₱1,250.00', type: 'out', icon: 'person', color: '#E53E3E' },
      { id: '4', title: 'Salary Credited', time: '9:00 AM', amount: '+₱45,000.00', type: 'in', icon: 'briefcase', color: '#006D77' },
    ]
  },
  {
    title: "July 6, 2026",
    data: [
      { id: '5', title: 'Withdraw to Bank', time: '9:00 AM', amount: '-₱2,000.00', type: 'out', icon: 'business', color: '#E53E3E' },
      { id: '6', title: 'Cashback Reward', time: '2:45 PM', amount: '+₱50.00', type: 'in', icon: 'gift', color: '#006D77' },
      { id: '7', title: 'Bill Payment - Electric', time: '8:20 AM', amount: '-₱1,850.50', type: 'out', icon: 'flash', color: '#E53E3E' },
    ]
  }
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <View className="flex-1 bg-[#fbf9f8]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
        <Text className="text-headline-lg font-bold text-on-surface">History</Text>
        <Pressable className="w-10 h-10 rounded-full bg-white items-center justify-center border border-gray-100 shadow-sm active:opacity-70">
          <Ionicons name="search" size={20} color="#006D77" />
        </Pressable>
      </View>

      {/* Filter Chips */}
      <View className="mb-4">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 4 }}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full border mr-2 active:opacity-70 transition-colors ${
                  isActive 
                    ? 'bg-[#006D77] border-[#006D77]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text 
                  className={`text-label-sm font-semibold ${
                    isActive ? 'text-white' : 'text-on-surface-variant'
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* History List */}
      <SectionList
        sections={MOCK_HISTORY}
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
                index === 0 ? 'rounded-t-[24px]' : ''
              } ${
                isLast ? 'rounded-b-[24px] mb-2' : 'border-b border-gray-50'
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
                    <Text className="text-body-lg font-bold text-on-surface" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text className="text-label-sm text-on-surface-variant mt-0.5">
                      {item.time}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text 
                    className="text-body-lg font-bold" 
                    style={{ color: item.type === 'in' ? '#006D77' : '#1b1c1c' }}
                  >
                    {item.amount}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
