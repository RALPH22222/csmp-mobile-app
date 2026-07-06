import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator/Web
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const authApi = {
    register: async (userData: any) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },

    verifyOtp: async (mobilePhone: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobilePhone, otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'OTP Verification failed');
        return data;
    },

    resendOtp: async (mobilePhone: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobilePhone }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Resend OTP failed');
        return data;
    }
};
