import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { authApi } from '@/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [mobilePhone, setMobilePhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleMobilePhoneChange = (text: string) => {
    setMobilePhone(text.replace(/[^0-9]/g, ''));
  };

  const handleLoginSubmit = async () => {
    if (!mobilePhone || !password) {
      Alert.alert('Error', 'Please enter your phone number and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authApi.login(mobilePhone, password);
      if (response.requireOtp) {
        setIsOtpStep(true);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyLoginOtp(mobilePhone, otp);
      if (response.success && response.session && response.token) {
        // Automatically stores session & routes to home via AuthContext
        await login(response.token, response.session.refresh_token);
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-container-margin"
      >
        <View className="items-center mb-xl">
          <View className="h-[80px] w-[80px] bg-primary rounded-xl items-center justify-center shadow-level-1 mb-md">
            <Text className="text-on-primary text-headline-lg font-bold">CS</Text>
          </View>
          <Text className="text-headline-lg text-on-background font-bold text-center">
            {isOtpStep ? 'Verification Required' : 'Welcome Back'}
          </Text>
          <Text className="text-body-md text-on-surface-variant text-center mt-xs">
            {isOtpStep ? `Enter the 6-digit code sent to ${mobilePhone}` : 'Sign in to continue to CSMP Paluwagan'}
          </Text>
        </View>

        {!isOtpStep ? (
          <View className="bg-surface rounded-lg p-md shadow-level-1 gap-md">
            <View className="gap-xs">
              <Text className="text-label-lg text-on-surface font-semibold">Mobile Phone Number</Text>
              <TextInput
                className="h-touch-target-min px-md bg-surface-container-lowest rounded-md text-body-md text-on-surface border border-outline-variant focus:border-primary"
                placeholder="e.g. 09123456789"
                placeholderTextColor="#6f797a"
                value={mobilePhone}
                onChangeText={handleMobilePhoneChange}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            <View className="gap-xs">
              <Text className="text-label-lg text-on-surface font-semibold">Password</Text>
              <TextInput
                className="h-touch-target-min px-md bg-surface-container-lowest rounded-md text-body-md text-on-surface border border-outline-variant focus:border-primary"
                placeholder="Enter your password"
                placeholderTextColor="#6f797a"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable 
              onPress={handleLoginSubmit}
              disabled={isLoading}
              className={`h-touch-target-min rounded-xl items-center justify-center mt-sm active:opacity-80 ${isLoading ? 'bg-outline' : 'bg-primary'}`}
            >
              <Text className="text-on-primary text-label-lg font-bold">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-sm">
              <Text className="text-on-surface-variant text-body-md">Don't have an account? </Text>
              <Link href="/pages/auth/register" asChild>
                <Pressable>
                  <Text className="text-primary text-body-md font-bold">Register</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        ) : (
          <View className="bg-surface rounded-lg p-md shadow-level-1 gap-md">
            <View className="gap-xs">
              <Text className="text-label-lg text-on-surface font-semibold">6-Digit Code</Text>
              <TextInput
                className="h-touch-target-min px-md bg-surface-container-lowest rounded-md text-body-md text-on-surface border border-outline-variant focus:border-primary text-center tracking-[10px]"
                placeholder="------"
                placeholderTextColor="#6f797a"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <Pressable 
              onPress={handleOtpSubmit}
              disabled={isLoading}
              className={`h-touch-target-min rounded-xl items-center justify-center mt-sm active:opacity-80 ${isLoading ? 'bg-outline' : 'bg-primary'}`}
            >
              <Text className="text-on-primary text-label-lg font-bold">
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => setIsOtpStep(false)}
              className="h-touch-target-min border border-outline rounded-xl items-center justify-center mt-xs"
            >
              <Text className="text-on-surface text-label-lg font-bold">Back</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
