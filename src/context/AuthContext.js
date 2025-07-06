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
                const response = await fetch(`${BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    toast.success(result.message || "You have been logged out successfully.", {
                        duration: 3000,
                        position: "top-right",
                    });
                } else {
                    const errorMessage = result.message || "Logout failed. Please try again.";
                    toast.error(errorMessage, {
                        duration: 3000,
                        position: "top-right",
                    });
                }
            }
        } catch (err) {
            console.error("Logout API call failed:", err.message);
            toast.error("An error occurred while logging out.", {
                duration: 2000,
                position: "top-right",
            });
        } finally {
            apiClient.removeToken();

            setToken(null);
            setUser(null);
            setTokenExpiryTime(0);
            setAuthLoading(false);
            if (typeof window !== 'undefined') {
                router.push('/auth/login?logout_success=true');
            }
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

            const result = await response.json();

            console.log("🔑 Login response result:", result); // Debug 1

            if (response.ok && result.status === "success") {
                const accessToken = result?.data?.auth?.access_token;
                const expiresIn = result?.data?.auth?.expires_in;
                console.log("✅ Access Token:", accessToken); // Debug 2
                console.log("⏳ Expired In (seconds):", expiresIn); // Debug 3

                if (!accessToken || !expiresIn) throw new Error("Token or expiry data not found.");

                apiClient.setToken(accessToken, expiresIn);
                setToken(accessToken);
                setTokenExpiryTime(Date.now() + (expiresIn * 1000));

                await fetchUser(accessToken); // Fetch user for context

                const finalUser = result.data.user || null;

                console.log("🎉 Login success, return result:", {
                    success: true,
                    user: finalUser,
                    message: result.message,
                });

                return {
                    success: true,
                    user: result.data.user || null,
                    message: result.message || null,
                };
            } else {
                const errorMessage = result.message || "Please check your email and password.";
                const error = new Error(errorMessage);
                error.errors = result.errors;
                setError(error);
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            }
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

            const result = await response.json();

            if (response.ok && result.status === "success") {
                return {
                    success: true,
                    message: result.message || null,
                };
            } else {
                const errorMessage = result.message || "Registration failed. Please check your input and try again.";
                const error = new Error(errorMessage);
                error.errors = result.errors;
                setError(error);
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            }
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
            const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email}),
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                toast.success(result.message || "Link reset password telah dikirim ke email Anda.");
                return {
                    success: true,
                    message: result.message || null,
                    throttle: result.data?.throttle_info || null,
                };
            } else {
                const errorMessage = result.message || "Gagal mengirim link reset password. Silakan coba lagi.";
                setError(new Error(errorMessage));
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            }
        } catch (err) {
            console.error("Error during forgot password request in AuthContext:", err);
            const errorMessage = err?.message || "Terjadi kesalahan saat mengirim permintaan. Pastikan email Anda benar.";
            setError(new Error(errorMessage));
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAuthLoading(false);
        }
    };

    const resetPassword = async ({ email, password, password_confirmation }) => {
        setAuthLoading(true);
        setError(null);

        try {
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");

            const response = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                toast.success(data.message || "Password berhasil direset.");
                return { success: true, message: data.message };
            } else {
                const errorMessage = data.message || "Gagal mereset password.";
                const error = new Error(errorMessage);
                error.errors = data.errors || {};
                throw error;
            }
        } catch (err) {
            setError(err);
            return { success: false, message: err.message };
        } finally {
            setAuthLoading(false);
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
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);