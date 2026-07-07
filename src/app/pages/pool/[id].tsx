import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_POOLS } from "../../../constants/mockPools";
import "../../../global.css";

const MOCK_MEMBERS = [
  {
    id: "m1",
    name: "Aling Rosa",
    week: 1,
    status: "Paid",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "m2",
    name: "Kuya Jun",
    week: 2,
    status: "Paid",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "m3",
    name: "Maria",
    week: 3,
    status: "Current Week",
    isYou: true,
    image: "https://i.pravatar.cc/150?img=5",
  },
  { id: "m4", name: "Lorna", week: 4, status: "Pending" },
  { id: "m5", name: "Elena", week: 5, status: "Pending" },
];

export default function PoolDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const pool = MOCK_POOLS.find((p) => p.id === id) || MOCK_POOLS[0];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-3 bg-white border-b border-[#f0f2f2] flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-[#f0f2f2] items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={22} color="#003840" />
        </TouchableOpacity>
        <Text
          className="flex-1 text-[18px] font-extrabold text-[#003840]"
          numberOfLines={1}
        >
          {pool.title}
        </Text>
      </View>

      {/* Body */}
      <View className="flex-1 bg-[#f7f9f9]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View
            className="bg-white rounded-[24px] p-5 mb-4 border border-[#f0f2f2]"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            {/* Amount Row */}
            <View className="flex-row items-center mb-5">
              <View className="w-14 h-14 rounded-full bg-[#006D77] items-center justify-center mr-3.5">
                <MaterialCommunityIcons
                  name="piggy-bank"
                  size={28}
                  color="#ffffff"
                />
              </View>
              <View>
                <Text className="text-[12px] text-[#6f797a] font-medium mb-0.5">
                  Total Locked Pool
                </Text>
                <Text className="text-[28px] font-extrabold text-[#006D77]">
                  ₱ {pool.totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-[13px] font-bold text-[#003840]">
                Week 3 of 5
              </Text>
              <Text className="text-[12px] text-[#6f797a]">
                ₱ {pool.contributionPerWeek.toLocaleString()} / week
              </Text>
            </View>
            <View className="h-2.5 bg-[#e0f7fa] rounded-full overflow-hidden mb-5">
              <View className="h-full w-[60%] bg-[#006D77] rounded-full" />
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-[#006D77] py-3.5 rounded-[14px]"
            >
              <FontAwesome5 name="money-bill-wave" size={16} color="#ffffff" />
              <Text className="text-[15px] font-bold text-white ml-2">
                Pay Week 3 Share
              </Text>
            </TouchableOpacity>
          </View>

          {/* Join Pool Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center justify-center py-3.5 rounded-[14px] border-2 border-[#006D77] mb-7"
          >
            <Ionicons name="person-add-outline" size={18} color="#006D77" />
            <Text className="text-[15px] font-bold text-[#006D77] ml-2">
              Join this Pool
            </Text>
          </TouchableOpacity>

          {/* Member Roster */}
          <Text className="text-[17px] font-extrabold text-[#003840] mb-3.5">
            Member Roster
          </Text>

          <View
            className="bg-white overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            {MOCK_MEMBERS.map((member, index) => {
              const isLast = index === MOCK_MEMBERS.length - 1;
              const isCurrent = member.status === "Current Week";
              const isPaid = member.status === "Paid";

              return (
                <View
                  key={member.id}
                  className="flex-row items-center p-4"
                  style={{
                    backgroundColor: isCurrent ? "#f0fbfc" : "#ffffff",
                    borderLeftWidth: 4,
                    borderLeftColor: isCurrent ? "#006D77" : "transparent",
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: "#f0f2f2",
                  }}
                >
                  {/* Avatar */}
                  <View className="mr-3.5">
                    {member.image ? (
                      <Image
                        source={{ uri: member.image }}
                        className="w-[46px] h-[46px] rounded-full"
                      />
                    ) : (
                      <View className="w-[46px] h-[46px] rounded-full bg-[#e0f7fa] items-center justify-center">
                        <Text className="text-[16px] font-bold text-[#006D77]">
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center mb-0.5">
                      <Text className="text-[14px] font-bold text-[#003840]">
                        {member.name} {member.isYou && "(You)"}
                      </Text>
                      {isCurrent && (
                        <View className="ml-1.5 bg-[#003840] px-1.5 py-0.5 rounded">
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
                        fontWeight: isCurrent ? "600" : "400",
                      }}
                    >
                      {isCurrent
                        ? "Receives payout this Friday"
                        : `Week ${member.week} Payout`}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View>
                    {isPaid ? (
                      <View className="flex-row items-center bg-[#00897b] px-2.5 py-1.5 rounded-full">
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
                      <View className="flex-row items-center bg-[#006D77] px-2.5 py-1.5 rounded-full opacity-90">
                        <Ionicons
                          name="hourglass-outline"
                          size={14}
                          color="#e0f7fa"
                        />
                        <Text className="text-[12px] font-bold text-[#e0f7fa] ml-1">
                          Pending
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center bg-[#f0f2f2] px-2.5 py-1.5 rounded-full border border-[#dce0e0]">
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#6f797a"
                        />
                        <Text className="text-[12px] font-bold text-[#6f797a] ml-1">
                          Upcoming
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
