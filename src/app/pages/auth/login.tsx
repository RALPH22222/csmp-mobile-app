import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Navigate or perform login logic
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-container-margin"
      >
        <View className="items-center mb-xl">
          {/* Logo Placeholder */}
          <View className="h-[80px] w-[80px] bg-primary rounded-xl items-center justify-center shadow-level-1 mb-md">
            <Text className="text-on-primary text-headline-lg font-bold">CS</Text>
          </View>
          <Text className="text-headline-lg text-on-background font-bold text-center">
            Welcome Back
          </Text>
          <Text className="text-body-md text-on-surface-variant text-center mt-xs">
            Sign in to continue to CSMP Paluwagan
          </Text>
        </View>

        <View className="bg-surface rounded-lg p-md shadow-level-1 gap-md">
          <View className="gap-xs">
            <Text className="text-label-lg text-on-surface font-semibold">Username</Text>
            <TextInput
              className="h-touch-target-min px-md bg-surface-container-lowest rounded-md text-body-md text-on-surface border border-outline-variant focus:border-primary"
              placeholder="Enter your username"
              placeholderTextColor="#6f797a"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
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
            onPress={handleLogin}
            className="h-touch-target-min bg-primary rounded-xl items-center justify-center mt-sm active:opacity-80"
          >
            <Text className="text-on-primary text-label-lg font-bold">Sign In</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
