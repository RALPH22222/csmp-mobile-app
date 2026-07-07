import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import "../global.css";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, profilePic, updateProfilePic } = useAuth();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await updateProfilePic(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-surface-dim">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:opacity-70">
          <Ionicons name="arrow-back" size={24} color="#1b1c1c" />
        </Pressable>
        <Text className="text-headline-md font-bold text-on-surface ml-4">Profile</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Profile Picture Header */}
        <View className="items-center mb-8">
          <Pressable onPress={pickImage} className="relative active:opacity-80">
            <View className="w-24 h-24 bg-surface-container-high rounded-full overflow-hidden items-center justify-center border-4 border-white shadow-level-1">
              {profilePic ? (
                <Image source={{ uri: profilePic }} className="w-full h-full" />
              ) : (
                <Ionicons name="person" size={48} color="#006D77" />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </Pressable>
          <Text className="text-headline-md font-bold text-on-surface mt-4">Louise Klyde</Text>
        </View>

        {/* Personal Info Section */}
        <Text className="text-label-lg text-primary font-bold mb-4 uppercase">Personal Info</Text>
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-level-1">
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-body-md text-on-surface-variant">Name</Text>
            <Text className="text-body-md font-bold text-on-surface">Louise Klyde</Text>
          </View>
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-body-md text-on-surface-variant">Phone Number</Text>
            <Text className="text-body-md font-bold text-on-surface">+63 912 345 6789</Text>
          </View>
        </View>

        {/* Security Section */}
        <Text className="text-label-lg text-primary font-bold mb-4 uppercase">Security</Text>
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-level-1">
          <Pressable className="flex-row items-center justify-between py-3 active:opacity-70">
            <View className="flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="#1b1c1c" className="mr-3" />
              <Text className="text-body-md text-on-surface">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#6f797a" />
          </Pressable>
        </View>

        {/* Preferences Section */}
        <Text className="text-label-lg text-primary font-bold mb-4 uppercase">Preferences</Text>
        <View className="bg-white rounded-2xl p-4 mb-8 shadow-level-1">
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-body-md text-on-surface">Push Notifications</Text>
            <Ionicons name="toggle" size={32} color="#006D77" />
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <Text className="text-body-md text-on-surface">Dark Mode</Text>
            <Ionicons name="toggle-outline" size={32} color="#bec8ca" />
          </View>
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-body-md text-on-surface">Language</Text>
            <View className="flex-row items-center">
              <Text className="text-body-md text-on-surface-variant mr-2">English</Text>
              <Ionicons name="chevron-forward" size={16} color="#6f797a" />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable 
          onPress={logout}
          className="bg-error-container rounded-xl py-4 flex-row items-center justify-center active:opacity-80 mb-12"
        >
          <Ionicons name="log-out-outline" size={20} color="#ba1a1a" className="mr-2" />
          <Text className="text-on-error-container text-label-lg font-bold ml-2">Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
