"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { toast } from "sonner"

const AuthContext = createContext();
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [tokenExpiryTime, setTokenExpiryTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const logout = useCallback(async () => {
        setAuthLoading(true);
        setError(null);
        try {
            const accessToken = apiClient.getToken();
            if (accessToken) {
                await fetch(`${BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
            }
        } catch (err) {
            console.error("Logout API call failed:", err.message);
        } finally {
            apiClient.removeToken();

            setToken(null);
            setUser(null);
            setTokenExpiryTime(0);
            setAuthLoading(false);
            if (typeof window !== 'undefined') router.push('/auth/login?logout_success=true');
        }
    }, [router]);

    const refreshToken = useCallback(async () => {
        setAuthLoading(true);
        try {
            const { token: newTokenValue, ttl: newTtlValue } = await apiClient.refreshToken();
            setToken(newTokenValue);
            setTokenExpiryTime(Date.now() + (newTtlValue * 1000));
            return { token: newTokenValue, ttl: newTtlValue };
        } catch (err) {
            console.error("Failed to refresh token:", err.message);
            logout(); // Force logout if refresh fails
            throw err;
        } finally {
            setAuthLoading(false);
        }
    }, [logout]);

    const fetchUser = useCallback(async (accessToken) => {
        setAuthLoading(true);
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/auth/me`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const refreshedData = await refreshToken().catch(() => null);
                    if (refreshedData && refreshedData.token) {
                        return await fetchUser(refreshedData.token);
                    }
                }
                throw new Error(`Failed to fetch user: ${response.status}`);
            }

            const result = await response.json();
            if (result?.data?.user) {
                setUser(result.data.user);
            } else {
                throw new Error("User data not found.");
            }
        } catch (err) {
            console.error("Error fetching user:", err.message);
            logout();
        } finally {
            setAuthLoading(false);
            setLoading(false);
        }
    }, [logout, refreshToken]);

    // Initial load and token check
    useEffect(() => {
        const savedToken = apiClient.getToken();
        const savedExpiryTime = apiClient.getExpiryTime();

        if (savedToken && savedExpiryTime && Date.now() < savedExpiryTime) {
            setToken(savedToken);
            setTokenExpiryTime(savedExpiryTime);
            fetchUser(savedToken);
        } else {
            apiClient.removeToken();
            setToken(null);
            setUser(null);
            setTokenExpiryTime(0);
            setLoading(false);
        }
    }, [fetchUser]);

    // Token refresh interval logic
    useEffect(() => {
        const remainingTtl = (tokenExpiryTime - Date.now()) / 1000;

        if (!token || !tokenExpiryTime || remainingTtl <= 60) {
            if (token && remainingTtl <= 0) {
                logout(); // Logout if token is expired
            }
            return; // Skip setting interval
        }

        const refreshTriggerInMs = (remainingTtl - 60) * 1000;

        const intervalId = setInterval(() => {
            if (apiClient.hasToken()) {
                refreshToken();
            } else {
                clearInterval(intervalId); // Stop interval if no token
            }
        }, refreshTriggerInMs);

        return () => clearInterval(intervalId); // Cleanup on unmount/dependency change
    }, [token, tokenExpiryTime, refreshToken, logout]);

    const login = async (credentials) => {
        setAuthLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || "Please check your email and password.");
                error.errors = errorData.errors;
                throw error;
            }

            const result = await response.json();
            const accessToken = result?.data?.auth?.access_token;
            const expiresIn = result?.data?.auth?.expires_in;
            if (!accessToken || !expiresIn) throw new Error("Token or expiry data not found.");

            apiClient.setToken(accessToken, expiresIn);
            setToken(accessToken);
            setTokenExpiryTime(Date.now() + (expiresIn * 1000));
            await fetchUser(accessToken);

            return true;
        } catch (err) {
            setError(err);
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (dataUser) => {
        setAuthLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataUser),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || "Gagal melakukan registrasi. Silakan coba lagi.");
                error.errors = errorData.errors;
                throw error;
            }

            const result = await response.json();

            toast.success(result.message)

            await new Promise(resolve => setTimeout(resolve, 1500));

            return true;
        } catch (err) {
            setError(err);
        } finally {
            setAuthLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setAuthLoading(true);
        setError(null);

        try {
            const response = await fetch('/forgot-password', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(email),
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Link reset password telah dikirim ke email Anda.");
                return { success: true, message: response.data.message || "Link reset password telah dikirim." };
            } else {
                const errorData = response.data || {};
                const errorMessage = errorData.message || "Gagal mengirim link reset password. Silakan coba lagi.";
                setError(new Error(errorMessage)); // Set error state
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            }
        } catch (err) {
            console.error("Error during forgot password request in AuthContext:", err);
            const errorMessage = err.response?.data?.message || "Terjadi kesalahan saat mengirim permintaan. Pastikan email Anda benar.";
            setError(new Error(errorMessage)); // Set error state
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAuthLoading(false); // Selesai loading
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                authLoading,
                error,
                login,
                logout,
                register,
                refreshToken,
                forgotPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);