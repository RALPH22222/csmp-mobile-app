import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenManager } from '../api';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check for tokens on app start
    const checkAuth = async () => {
      try {
        const token = await TokenManager.getAccessToken();
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
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

  const login = async (accessToken: string, refreshToken: string) => {
    await TokenManager.setTokens(accessToken, refreshToken);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await TokenManager.clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
