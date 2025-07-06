import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

class ApiClient {
    constructor() {
        this.isRefreshing = false;
        this.failedQueue = [];
        this.refreshPromise = null;
        this.onTokenRefreshedCallback = null;
    }

    registerTokenRefreshedCallback(callback) {
        this.onTokenRefreshedCallback = callback;
    }

    getToken() {
        return Cookies.get("access_token");
    }

    getExpiryTime() {
        const expiry = Cookies.get("access_token_expiry");
        return expiry ? parseInt(expiry, 10) : null;
    }

    setToken(token, ttl = 900) { // Default 15 menit (900 detik)
        const expires = ttl / (24 * 60 * 60);
        Cookies.set("access_token", token, {
            expires,
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            sameSite: 'Lax'
        });
        const expiryTime = Date.now() + (ttl * 1000);
        Cookies.set("access_token_expiry", expiryTime.toString(), {
            expires,
            secure: false,
            sameSite: 'Lax'
        });
    }

    removeToken() {
        Cookies.remove("access_token");
        Cookies.remove("access_token_expiry");
    }

    hasToken() {
        const token = this.getToken();
        const expiryTime = this.getExpiryTime();
        if (token && expiryTime) {
            return Date.now() < expiryTime;
        }
        return false;
    }

    processQueue(error, token = null) {
        this.failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    async refreshToken() {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        const currentToken = this.getToken();
        if (!currentToken) {
            this.logout('no_token_for_refresh');
            throw new Error("No token available for refresh. Logging out.");
        }

        this.refreshPromise = this._performRefresh(currentToken);

        try {
            return await this.refreshPromise;
        } finally {
            this.refreshPromise = null;
        }
    }

    async _performRefresh(currentToken) {
        try {
            const response = await fetch(`${BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                this.logout('refresh_failed'); // Panggil logout di sini!
                throw new Error(`Refresh failed: ${response.status}`);
            }

            const result = await response.json();
            const newToken = result?.data?.auth?.access_token;
            const ttl = result?.data?.auth?.expires_in;

            if (!newToken || !ttl) {
                this.logout('invalid_refresh_response');
                throw new Error("Invalid refresh token response");
            }

            this.setToken(newToken, ttl);

            if (this.onTokenRefreshedCallback) {
                this.onTokenRefreshedCallback(currentToken, newToken);
            }

            return { token: newToken, ttl: ttl };
        } catch (error) {
            console.error("Token refresh error:", error.message);
            if (!this.refreshPromise) {
                this.logout('network_or_unexpected_refresh_error');
            }
            throw error;
        }
    }

    async makeRequest(url, options = {}) {
        let currentToken = this.getToken();

        if (!currentToken || !this.hasToken()) {
            try {
                const { token: refreshedToken } = await this.refreshToken();
                currentToken = refreshedToken;
            } catch (refreshError) {
                this.logout('initial_token_refresh_failed');
                throw new Error("Token refresh failed. Please log in again.");
            }
        }

        const isFormData = options.body instanceof FormData;
        const headers = {
            "Accept": "application/json",
            Authorization: `Bearer ${currentToken}`,
            ...(!isFormData && { "Content-Type": "application/json" }),
            ...options.headers
        };

        const requestOptions = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, requestOptions);

            if (response.status === 403) {
                this.logout('access_denied');
                throw new Error("Akses dilarang. Anda telah dikeluarkan dari sesi.");
            }

            if (response.status === 401) {
                try {
                    const { token: newToken } = await this.refreshToken();
                    return this.makeRequest(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            Authorization: `Bearer ${newToken}`
                        }
                    });
                } catch (refreshError) {
                    throw refreshError;
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                switch (response.status) {
                    case 404:
                        throw new Error("Data tidak ditemukan");
                    // case 422:
                    //     throw new Error(errorData || "Data yang dikirim tidak valid");
                    case 422:
                        throw errorData || "Data yang dikirim tidak valid";
                    case 500:
                        throw {
                            status_code: 500,
                            message: "Terjadi kesalahan pada server.<br>Data tidak dapat dihapus karena mempunyai relasi pada tabel lain!",
                            originalError: errorData
                        };
                    default:
                        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
                }
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return {};
        } catch (error) {
            // if (error.name !== 'TypeError') {
            //     console.error("API request error:", error.message);
            // }
            throw error;
        }
    }

    logout(reason = "access_denied") {
        this.removeToken();
        if (typeof window !== 'undefined') {
            window.location.replace(`/auth/login?logout=${reason}`);
        }
    }
}

const apiClient = new ApiClient();

export default apiClient;