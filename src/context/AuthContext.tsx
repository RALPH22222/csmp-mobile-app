import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenManager } from '../api';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  profilePic: string | null;
  user: any;
  login: (accessToken: string, refreshToken: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfilePic: (uri: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  profilePic: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  updateProfilePic: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check for tokens on app start
    const checkAuth = async () => {
      try {
        // We purposefully DO NOT set isLoggedIn(true) here anymore
        // even if a token exists, so the user is forced to re-authenticate
        // via the Login screen (App Lock behavior).
        setIsLoggedIn(false);
        
        const storedProfilePic = await AsyncStorage.getItem('profile_pic');
        if (storedProfilePic) {
          setProfilePic(storedProfilePic);
        }

        const storedUser = await AsyncStorage.getItem('user_data');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'pages' && segments[1] === 'auth';
    
    if (isLoggedIn && inAuthGroup) {
      // If logged in and trying to access auth screens, redirect to home
      // Using setTimeout to prevent React state update collisions during render
      setTimeout(() => router.replace('/'), 0);
    } else if (!isLoggedIn && !inAuthGroup) {
      // If NOT logged in and trying to access protected screens, redirect to login
      setTimeout(() => router.replace('/pages/auth/login'), 0);
    }
  }, [isLoggedIn, segments, isLoading]);

  const updateProfilePic = async (uri: string) => {
    await AsyncStorage.setItem('profile_pic', uri);
    setProfilePic(uri);
  };

  const login = async (accessToken: string, refreshToken: string, userData?: any) => {
    await TokenManager.setTokens(accessToken, refreshToken);
    if (userData) {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await TokenManager.clearTokens();
    await AsyncStorage.removeItem('user_data');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, profilePic, user, login, logout, updateProfilePic }}>
      {children}
    </AuthContext.Provider>
  );
};
