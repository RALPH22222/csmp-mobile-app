import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env'; 

export const TokenManager = {
    setTokens: async (accessToken: string, refreshToken: string) => {
        await AsyncStorage.multiSet([
            ['access_token', accessToken],
            ['refresh_token', refreshToken]
        ]);
    },
    getAccessToken: async () => AsyncStorage.getItem('access_token'),
    getRefreshToken: async () => AsyncStorage.getItem('refresh_token'),
    clearTokens: async () => AsyncStorage.multiRemove(['access_token', 'refresh_token'])
};

// Helper to make authenticated requests with auto-refresh
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    let token = await TokenManager.getAccessToken();
    
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    // If unauthorized, try to refresh the token
    if (response.status === 401) {
        const refreshToken = await TokenManager.getRefreshToken();
        if (refreshToken) {
            try {
                const refreshRes = await authApi.refreshSession(refreshToken);
                if (refreshRes.success && refreshRes.session) {
                    await TokenManager.setTokens(refreshRes.session.access_token, refreshRes.session.refresh_token);
                    token = refreshRes.session.access_token;
                    
                    // Retry original request
                    response = await fetch(`${API_BASE_URL}${endpoint}`, {
                        ...options,
                        headers: {
                            ...options.headers,
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    await TokenManager.clearTokens();
                }
            } catch (err) {
                await TokenManager.clearTokens();
            }
        }
    }
    return response;
};

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
    },

    login: async (mobilePhone: string, password: string, isReturningUser: boolean = false) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobilePhone, password, isReturningUser }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    verifyLoginOtp: async (mobilePhone: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobilePhone, otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login OTP Verification failed');
        return data;
    },

    refreshSession: async (refresh_token: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Session refresh failed');
        return data;
    }
};

export const poolApi = {
    getAllPools: async () => {
        const response = await fetchWithAuth('/pools');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch pools');
        return data;
    },
    getMyPools: async (userId: string) => {
        const response = await fetchWithAuth(`/pools/user/${userId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch my pools');
        return data;
    },
    getPoolById: async (poolId: string) => {
        const response = await fetchWithAuth(`/pools/${poolId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch pool details');
        return data;
    },
    createPool: async (poolData: {
        name: string;
        total_members: number;
        max_members: number;
        total_payout_amount: number;
        cycle_duration_days: number;
        organizer_id: string;
        join_as_member?: boolean;
    }) => {
        const response = await fetchWithAuth('/pools', {
            method: 'POST',
            body: JSON.stringify(poolData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create pool');
        return data;
    },
    joinPool: async (poolId: string, userId: string, sequence: number) => {
        const response = await fetchWithAuth(`/pools/${poolId}/join`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, sequence }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to join pool');
        return data;
    }
};
