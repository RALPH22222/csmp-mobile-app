import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CustomAlert } from "../../utils/Alert";
import { poolApi } from "../../api";
import { useAuth } from "../../context/AuthContext";
import "../../global.css";

export default function CreatePoolScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [name, setName] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [totalPayoutAmount, setTotalPayoutAmount] = useState("");
  const [cycleDuration, setCycleDuration] = useState("");
  const [joinAsMember, setJoinAsMember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showCyclePicker, setShowCyclePicker] = useState(false);

  const CYCLE_OPTIONS = [
    { label: "Weekly", value: "7" },
    { label: "Bi-Weekly", value: "14" },
    { label: "Monthly", value: "30" },
  ];

  const selectedCycleLabel = CYCLE_OPTIONS.find(c => c.value === cycleDuration)?.label || "Select Cycle";

  const cycleDurationAmount = totalPayoutAmount && maxMembers && parseInt(maxMembers, 10) > 0
    ? Math.floor(parseInt(totalPayoutAmount, 10) / parseInt(maxMembers, 10))
    : 0;

  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name) newErrors.name = "Pool Name is required";
    if (!maxMembers) newErrors.maxMembers = "Max Members is required";
    if (!totalPayoutAmount) newErrors.totalPayoutAmount = "Total Payout Amount is required";
    if (!cycleDuration) newErrors.cycleDuration = "Cycle Duration is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    if (!user?.id) {
      CustomAlert.error("Error", "You must be logged in to create a pool.");
      return;
    }

    setIsLoading(true);
    try {
      await poolApi.createPool({
        name,
        total_members: parseInt(maxMembers || "0", 10),
        max_members: parseInt(maxMembers || "0", 10),
        total_payout_amount: parseInt(totalPayoutAmount || "0", 10),
        cycle_duration_days: parseInt(cycleDuration || "0", 10),
        organizer_id: user.id,
        join_as_member: joinAsMember,
      });
      CustomAlert.success("Success", "Pool created and pending review!");
      router.back();
    } catch (err: any) {
      CustomAlert.error("Error", err.message || "Failed to create pool");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f7f9f9]">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-[#f0f2f2]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <Ionicons name="arrow-back" size={24} color="#003840" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-[#003840]">Create a Pool</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 pb-12" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-[20px] p-6 border border-[#f0f2f2] shadow-sm mb-6">
          <Text className="text-[16px] font-bold text-[#003840] mb-4">Pool Details</Text>
          
          <View className="mb-4">
            <Text className="text-[13px] font-semibold text-[#6f797a] mb-2">Pool Name</Text>
            <TextInput
              placeholder="e.g. Dream Vacation Fund"
              value={name}
              onChangeText={(text) => { setName(text); setErrors({ ...errors, name: null }); }}
              className={`bg-[#f7f9f9] border ${errors.name ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-[12px] px-4 py-3 text-[15px] text-[#003840]`}
              placeholderTextColor="#9aa4a5"
            />
            {errors.name && <Text className="text-red-500 text-[11px] mt-1">{errors.name}</Text>}
          </View>

          <View className="mb-4 flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-[13px] font-semibold text-[#6f797a] mb-2">Max Members</Text>
              <TextInput
                placeholder="e.g. 10"
                keyboardType="numeric"
                value={maxMembers}
                onChangeText={(text) => { setMaxMembers(text); setErrors({ ...errors, maxMembers: null }); }}
                className={`bg-[#f7f9f9] border ${errors.maxMembers ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-[12px] px-4 py-3 text-[15px] text-[#003840]`}
                placeholderTextColor="#9aa4a5"
              />
              {errors.maxMembers && <Text className="text-red-500 text-[11px] mt-1">{errors.maxMembers}</Text>}
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-[13px] font-semibold text-[#6f797a] mb-2">Cycle Duration</Text>
              <TouchableOpacity
                onPress={() => setShowCyclePicker(true)}
                className={`bg-[#f7f9f9] border ${errors.cycleDuration ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-[12px] px-4 py-3.5 flex-row items-center justify-between`}
              >
                <Text className={`text-[15px] ${cycleDuration ? 'text-[#003840]' : 'text-[#9aa4a5]'}`}>
                  {selectedCycleLabel}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6f797a" />
              </TouchableOpacity>
              {errors.cycleDuration && <Text className="text-red-500 text-[11px] mt-1">{errors.cycleDuration}</Text>}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[13px] font-semibold text-[#6f797a] mb-2">Total Payout Amount (₱)</Text>
            <TextInput
              placeholder="e.g. 1000"
              keyboardType="numeric"
              value={totalPayoutAmount}
              onChangeText={(text) => { setTotalPayoutAmount(text); setErrors({ ...errors, totalPayoutAmount: null }); }}
              className={`bg-[#f7f9f9] border ${errors.totalPayoutAmount ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-[12px] px-4 py-3 text-[15px] text-[#003840]`}
              placeholderTextColor="#9aa4a5"
            />
            {errors.totalPayoutAmount && <Text className="text-red-500 text-[11px] mt-1">{errors.totalPayoutAmount}</Text>}
          </View>

          {cycleDurationAmount > 0 && (
            <View className="mb-4 p-4 bg-[#e0f7fa] rounded-[12px] border border-[#b2ebf2]">
              <Text className="text-[13px] font-semibold text-[#006D77] mb-1">Cycle Duration Amount (Contribution)</Text>
              <Text className="text-[18px] font-extrabold text-[#003840]">₱ {cycleDurationAmount}</Text>
              <Text className="text-[11px] text-[#006D77] mt-1">
                Each member contributes this amount every {cycleDuration || 'cycle'} days.
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between p-4 bg-[#f7f9f9] rounded-[12px] border border-[#e0e0e0]">
            <View className="flex-1 pr-4">
              <Text className="text-[14px] font-bold text-[#003840]">Join as Member</Text>
              <Text className="text-[11px] text-[#6f797a] mt-1">
                Will you be actively participating and contributing to this pool?
              </Text>
            </View>
            <Switch
              value={joinAsMember}
              onValueChange={setJoinAsMember}
              trackColor={{ false: "#dce0e0", true: "#006D77" }}
              thumbColor={"#ffffff"}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleSubmit()}
          disabled={isLoading}
          className="bg-[#006D77] rounded-[16px] py-4 items-center justify-center mb-4 shadow-md active:opacity-80"
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-[16px] font-bold">Create Pool</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Cycle Duration Dropdown Modal */}
      <Modal visible={showCyclePicker} transparent={true} animationType="fade">
        <TouchableOpacity 
          className="flex-1 justify-center items-center bg-black/50 px-6"
          activeOpacity={1}
          onPress={() => setShowCyclePicker(false)}
        >
          <View className="bg-white rounded-[20px] w-full p-4 overflow-hidden shadow-lg">
            <Text className="text-[16px] font-bold text-[#003840] mb-4 text-center">Select Cycle Duration</Text>
            {CYCLE_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setCycleDuration(option.value);
                  setErrors({ ...errors, cycleDuration: null });
                  setShowCyclePicker(false);
                }}
                className={`py-4 flex-row justify-between items-center ${index !== CYCLE_OPTIONS.length - 1 ? 'border-b border-[#f0f2f2]' : ''}`}
              >
                <Text className={`text-[16px] ${cycleDuration === option.value ? 'font-bold text-[#006D77]' : 'text-[#003840]'}`}>
                  {option.label}
                </Text>
                {cycleDuration === option.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#006D77" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
