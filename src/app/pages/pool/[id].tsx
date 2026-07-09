import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { poolApi } from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import Skeleton from "../../../components/Skeleton";
import "../../../global.css";



export default function PoolDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [pool, setPool] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const fetchPool = async () => {
    try {
      setIsLoading(true);
      const data = await poolApi.getPoolById(id as string);
      setPool(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPool();
    }, [id])
  );

  const handleJoin = async () => {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to join.");
      return;
    }
    try {
      setIsJoining(true);
      // Determine next sequence based on current members or default to 1
      const seq = pool?.pool_members?.length ? pool.pool_members.length + 1 : 1;
      await poolApi.joinPool(id as string, user.id, seq);
      Alert.alert("Success", "You have joined the pool!");
      fetchPool();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to join pool.");
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading || !pool) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 py-3 border-b border-[#f0f2f2] flex-row items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-full" />
          <View className="flex-row items-center">
            <Skeleton className="w-20 h-4 mr-3" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </View>
        </View>
        <ScrollView className="flex-1 bg-[#f7f9f9]" contentContainerStyle={{ alignItems: 'center', paddingTop: 32, paddingHorizontal: 20 }}>
          <Skeleton className="w-3/4 h-8 mb-8" />
          <Skeleton className="w-[290px] h-[290px] rounded-full mb-10" />
          <Skeleton className="w-48 h-6 mb-2" />
          <Skeleton className="w-64 h-4 mb-8" />
          <Skeleton className="w-full h-14 rounded-[16px] mb-3" />
          <Skeleton className="w-full h-14 rounded-[16px] mb-6" />
          <View className="w-full mb-6">
            <Skeleton className="w-32 h-6 mb-4" />
            <Skeleton className="w-full h-32 rounded-[16px]" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isMember = pool.pool_members?.some((m: any) => m.user_id === user?.id);
  const currentMembers = pool.pool_members?.length || 0;
  const maxMembers = pool.max_members || 1;
  
  // Calculate total amount contributed by all members
  const totalContributed = pool.pool_members?.reduce((sum: number, m: any) => sum + (Number(m.total_contributed) || 0), 0) || 0;
  const targetPoolAmount = Number(pool.total_payout_amount) || 1;
  
  // Dynamic contribution amount depends on current members
  const dynamicContribution = currentMembers > 0 
    ? (targetPoolAmount / currentMembers) 
    : targetPoolAmount;

  // Circle Graph properties
  const size = 290;
  const strokeWidth = 28;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Progress is based on total amount contributed vs total target amount
  const progress = Math.min(totalContributed / targetPoolAmount, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-3 bg-white border-b border-[#f0f2f2] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-[#f0f2f2] items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#003840" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-[14px] font-bold text-[#003840] mr-3">
            {currentMembers}/{maxMembers} Members
          </Text>
          <TouchableOpacity
            onPress={() => setShowMembers(true)}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-[#e0f7fa] items-center justify-center border border-[#b2ebf2]"
          >
            <Ionicons name="people" size={22} color="#006D77" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView className="flex-1 bg-[#f7f9f9]" contentContainerStyle={{ alignItems: 'center', paddingTop: 32, paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Pool Name on top of circle graph */}
        <Text className="text-[26px] font-extrabold text-[#003840] mb-8 text-center px-4">
          {pool.pool_name}
        </Text>

        {/* Circle Graph */}
        <View className="items-center justify-center mb-10 relative">
          <View
            style={{
              shadowColor: "#006D77",
              shadowOpacity: 0.1,
              shadowRadius: 15,
              shadowOffset: { width: 0, height: 8 },
              elevation: 5,
            }}
          >
            <Svg width={size} height={size}>
              <Defs>
                <LinearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#006D77" />
                  <Stop offset="1" stopColor="#00b4d8" />
                </LinearGradient>
              </Defs>
              <Circle
                stroke="#eafaf1"
                fill="none"
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke="url(#progressGrad)"
                fill="none"
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            </Svg>
          </View>
          
          {/* Inner Text */}
          <View className="absolute items-center justify-center">
            <Text className="text-[52px] font-extrabold text-[#006D77]" style={{ letterSpacing: -2 }}>
              {Math.round(progress * 100)}%
            </Text>
            <Text className="text-[14px] text-[#6f797a] font-extrabold tracking-widest uppercase mt-[-5px]">
              Funded
            </Text>
          </View>
        </View>

        {/* Squiggles/Progress Info */}
        <View className="items-center mb-8 w-full">
          <Text className="text-[20px] font-extrabold text-[#003840] mb-1">
            ₱{Number(totalContributed).toLocaleString()} <Text className="text-[#6f797a] font-medium text-[16px]">/ ₱{Number(pool.total_payout_amount || 0).toLocaleString()}</Text>
          </Text>
          <Text className="text-[14px] text-[#6f797a] font-medium text-center">
            Each cycle requires ₱{Number(dynamicContribution).toLocaleString()} every {pool.cycle_duration_days} days
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full">
          {pool.pool_status_id === 1 ? (
            isMember ? (
              <View className="bg-[#e0f7fa] py-4 rounded-[16px] items-center justify-center mb-6">
                <Text className="text-[#006D77] font-bold text-[16px]">
                  Waiting for members to join...
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleJoin}
                disabled={isJoining}
                className="flex-row items-center justify-center bg-[#006D77] py-4 rounded-[16px] shadow-sm mb-6"
                style={{ opacity: isJoining ? 0.7 : 1 }}
              >
                {isJoining ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={20} color="#ffffff" />
                    <Text className="text-[16px] font-bold text-white ml-2">
                      Join this Pool
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )
          ) : isMember ? (
            <>
              <TouchableOpacity
                activeOpacity={0.85}
                className="flex-row items-center justify-center bg-[#006D77] py-4 rounded-[16px] shadow-sm mb-3"
              >
                <FontAwesome5 name="money-bill-wave" size={18} color="#ffffff" />
                <Text className="text-[16px] font-bold text-white ml-2">
                  Pay Contribution
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                className="flex-row items-center justify-center bg-white border border-[#e0e0e0] py-4 rounded-[16px] shadow-sm mb-6"
              >
                <Ionicons name="wallet-outline" size={18} color="#003840" />
                <Text className="text-[16px] font-bold text-[#003840] ml-2">
                  Withdraw
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        {/* Recent Payouts */}
        <View className="w-full mb-6">
          <Text className="text-[18px] font-extrabold text-[#003840] mb-4">
            Recent Payouts
          </Text>
          <View className="bg-white rounded-[16px] border border-[#f0f2f2] items-center justify-center py-10 shadow-sm">
            <Ionicons name="receipt-outline" size={32} color="#b2ebf2" />
            <Text className="text-[14px] text-[#6f797a] mt-3 font-medium">No recent payouts.</Text>
          </View>
        </View>

      </ScrollView>

      {/* Members Modal */}
      <Modal
        visible={showMembers}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMembers(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[32px] h-[75%] pt-6 px-6 pb-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[22px] font-extrabold text-[#003840]">Member Roster</Text>
              <TouchableOpacity onPress={() => setShowMembers(false)} className="p-1">
                <Ionicons name="close-circle" size={32} color="#9aa4a5" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {(pool.pool_members || []).map((member: any, index: number) => {
                const isLast = index === (pool.pool_members?.length || 0) - 1;
                const statusName = member.member_statuses?.status_name || "Pending";
                const isCurrent = statusName.toLowerCase() === "current";
                const isPaid = statusName.toLowerCase() === "paid";
                const fullName = member.users ? `${member.users.first_name} ${member.users.last_name}` : "Unknown";
                const isYou = member.user_id === user?.id;

                return (
                  <View
                    key={member.id}
                    className="flex-row items-center p-4 rounded-[16px] mb-3"
                    style={{
                      backgroundColor: isCurrent ? "#f0fbfc" : "#f7f9f9",
                      borderWidth: isCurrent ? 2 : 1,
                      borderColor: isCurrent ? "#b2ebf2" : "#e0e0e0",
                    }}
                  >
                    {/* Avatar */}
                    <View className="mr-3.5">
                      <View className="w-[48px] h-[48px] rounded-full bg-[#006D77] items-center justify-center shadow-sm">
                        <Text className="text-[18px] font-bold text-white">
                          {fullName.charAt(0)}
                        </Text>
                      </View>
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-[15px] font-bold text-[#003840]">
                          {fullName} {isYou && "(You)"}
                        </Text>
                        {isCurrent && (
                          <View className="ml-2 bg-[#003840] px-2 py-0.5 rounded-md">
                            <Text className="text-[9px] font-extrabold text-white tracking-widest">
                              CURRENT
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        className="text-[12px]"
                        style={{
                          color: isCurrent ? "#006D77" : "#6f797a",
                          fontWeight: isCurrent ? "700" : "500",
                        }}
                      >
                        {isCurrent
                          ? "Receives payout this cycle"
                          : `Sequence ${member.payout_sequence_number}`}
                      </Text>
                    </View>

                    {/* Status Badge */}
                    <View>
                      {isPaid ? (
                        <View className="flex-row items-center bg-[#00897b] px-3 py-1.5 rounded-[10px]">
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#ffffff"
                          />
                          <Text className="text-[12px] font-bold text-white ml-1">
                            Paid
                          </Text>
                        </View>
                      ) : isCurrent ? (
                        <View className="flex-row items-center bg-[#006D77] px-3 py-1.5 rounded-[10px]">
                          <Ionicons
                            name="hourglass-outline"
                            size={14}
                            color="#ffffff"
                          />
                          <Text className="text-[12px] font-bold text-white ml-1">
                            Pending
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center bg-white px-3 py-1.5 rounded-[10px] border border-[#dce0e0]">
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#6f797a"
                          />
                          <Text className="text-[12px] font-bold text-[#6f797a] ml-1">
                            {statusName}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
              
              {(pool.pool_members?.length || 0) === 0 && (
                <View className="items-center justify-center py-10">
                  <Ionicons name="people-outline" size={48} color="#b2ebf2" />
                  <Text className="text-[#6f797a] mt-3 font-medium">No members have joined yet.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
