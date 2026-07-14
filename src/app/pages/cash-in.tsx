import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CustomAlert } from "../../utils/Alert";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../global.css";

const PRESET_AMOUNTS = [100, 500, 1000, 2000, 5000];

const formatNumber = (value: number): string => {
  if (isNaN(value)) return "0.00";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const decodeToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error("❌ Failed to decode token:", error);
    return null;
  }
};

const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Paths on our own API_BASE_URL that signal a terminal payment state
const RESULT_PATHS = {
  success: "/payment/success",
  failure: "/payment/failure",
  cancel: "/payment/cancel",
};

export default function CashInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [webviewVisible, setWebviewVisible] = useState(false);

  const handleAmountPress = (value: number) => {
    setAmount(value.toString());
  };

  const checkPaymentStatus = async (txId: string) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/paymaya/checkout/status/${txId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      const data = await response.json();

      if (data.status === "completed") {
        CustomAlert.success(
          "Payment Successful",
          `₱${formatNumber(data.amount)} has been added to your account.`
        );
        router.back();
      } else if (data.status === "failed") {
        CustomAlert.error(
          "Payment Failed",
          "Your payment was not completed. Please try again."
        );
      } else if (data.status === "pending") {
        CustomAlert.info(
          "Payment Pending",
          "Your payment is still being processed. Please check back later."
        );
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setTransactionId(null);
    }
  };

  const closeWebview = () => {
    setWebviewVisible(false);
    setCheckoutUrl(null);
    setIsLoading(false);
  };

  // Called whenever the WebView's URL changes, including redirects
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    if (!url) return;

    if (url.includes(RESULT_PATHS.success)) {
      closeWebview();
      if (transactionId) checkPaymentStatus(transactionId);
      return;
    }
    if (url.includes(RESULT_PATHS.failure)) {
      closeWebview();
      CustomAlert.error(
        "Payment Failed",
        "Your payment was not completed. Please try again."
      );
      return;
    }
    if (url.includes(RESULT_PATHS.cancel)) {
      closeWebview();
      return;
    }
  };

  // Block the WebView from trying to follow the csmpmobileapp:// deep link
  // (that's meant for an external browser flow, not this in-app WebView)
  const handleShouldStartLoad = (request: { url: string }) => {
    if (request.url.startsWith("csmpmobileapp://")) {
      return false;
    }
    return true;
  };

  const handleCashIn = async () => {
    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      CustomAlert.error("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (!isLoggedIn || !user?.id) {
      CustomAlert.error("Error", "You are not logged in. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAuthToken();

      if (!token) {
        CustomAlert.error("Error", "You are not logged in. Please login again.");
        setIsLoading(false);
        return;
      }

      const decodedPayload = decodeToken(token);
      console.log("📋 Decoded token payload:", decodedPayload);

      const response = await fetch(`${API_BASE_URL}/paymaya/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          description: `Cash In - ₱${numericAmount.toFixed(2)}`,
          referenceNumber: `CASH-${Date.now()}-${user.id.substring(0, 8)}`,
          metadata: {
            transaction_type: "cash_in",
            source: "mobile_app",
          },
          successUrl: `${API_BASE_URL}/payment/success`,
          failureUrl: `${API_BASE_URL}/payment/failure`,
          cancelUrl: `${API_BASE_URL}/payment/cancel`,
        }),
      });

      const data = await response.json();
      console.log("📥 Response status:", response.status);
      console.log("📥 Response data:", JSON.stringify(data, null, 2));

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || data.message || "Failed to create payment",
        );
      }

      if (data.transaction_id) {
        setTransactionId(data.transaction_id);
      }

      if (data.checkout_url) {
        setCheckoutUrl(data.checkout_url);
        setWebviewVisible(true);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Cash In Error:", error);
      CustomAlert.error(
        "Error",
        error.message || "Failed to process cash-in. Please try again."
      );
      setIsLoading(false);
    }
  };

  const formatAmount = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <LinearGradient
        colors={["#006D77", "#00CADD"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 24,
        }}
      >
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-4 p-1">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-headline-md font-bold flex-1">
            Cash In
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View
          className="bg-white rounded-[24px] p-6 mb-6 border border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Text className="text-label-lg font-bold text-on-surface-variant mb-2">
            Enter Amount
          </Text>
          <View className="flex-row items-center border-b-2 border-primary pb-2">
            <Text className="text-3xl font-bold text-on-surface mr-2">₱</Text>
            <TextInput
              className="flex-1 text-4xl font-bold text-on-surface py-2"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            {amount !== "" && (
              <Pressable
                onPress={() => setAmount("")}
                className="p-2 active:opacity-70"
              >
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
          <Text className="text-right text-label-sm text-on-surface-variant mt-1">
            Balance: ₱2,500.00
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-label-lg font-bold text-on-surface mb-3">
            Quick Amounts
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => handleAmountPress(preset)}
                className={`px-6 py-3 rounded-full border ${
                  amount === preset.toString()
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-200"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`font-bold ${
                    amount === preset.toString()
                      ? "text-white"
                      : "text-on-surface"
                  }`}
                >
                  ₱{preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-label-lg font-bold text-on-surface mb-3">
            Payment Method
          </Text>
          <View className="bg-white p-4 rounded-xl border border-gray-200 flex-row items-center">
            <View className="w-10 h-10 bg-[#e0f7fa] rounded-full items-center justify-center mr-4">
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#006D77"
              />
            </View>
            <Text className="flex-1 text-body-lg font-bold text-on-surface">
              Maya
            </Text>
            <Ionicons name="checkmark-circle" size={24} color="#006D77" />
          </View>
        </View>

        {amount && parseFloat(amount) > 0 && (
          <View className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
            <Text className="text-label-sm text-on-surface-variant mb-2">
              Summary
            </Text>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-body-sm text-on-surface-variant">
                Amount
              </Text>
              <Text className="text-body-sm font-bold text-on-surface">
                ₱{formatAmount(amount)}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-body-sm text-on-surface-variant">Fee</Text>
              <Text className="text-body-sm font-bold text-green-600">
                Free
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-body-sm font-bold text-on-surface-variant">
                Total
              </Text>
              <Text className="text-body-lg font-bold text-primary">
                ₱{formatAmount(amount)}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleCashIn}
          disabled={isLoading}
          className={`py-4 rounded-full ${
            !amount || parseFloat(amount) <= 0 || isLoading
              ? "bg-gray-300"
              : "bg-primary"
          }`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-center text-white text-body-lg font-bold">
              Cash In ₱{formatAmount(amount) || "0.00"}
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-center text-label-sm text-on-surface-variant mt-4">
          Transactions are secured and encrypted.
        </Text>
      </ScrollView>

      {/* Pay with Maya WebView drawer */}
      <Modal
        visible={webviewVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeWebview}
      >
        <View className="flex-1 bg-white">
          <View
            className="flex-row items-center justify-between px-4 border-b border-gray-100"
            style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
          >
            <Text className="text-body-lg font-bold text-on-surface">
              Pay with Maya
            </Text>
            <Pressable onPress={closeWebview} className="p-2">
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          {checkoutUrl && (
            <WebView
              source={{ uri: checkoutUrl }}
              onNavigationStateChange={handleNavigationStateChange}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
              startInLoadingState
              renderLoading={() => (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color="#006D77" />
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
