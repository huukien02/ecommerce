import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/",
    withCredentials: true,
});

// Request Interceptor: đính kèm access_token vào header
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: xử lý tự động refresh token khi gặp lỗi 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu mã lỗi là 401 (Unauthorized) và request chưa từng được retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Gọi api refresh token
                const refreshResponse = await axios.post(
                    `${api.defaults.baseURL}auth/refresh-token`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { access_token, refresh_token } = refreshResponse.data.data;
                
                // Lưu token mới
                setTokens(access_token, refresh_token);

                // Gắn token mới vào header của request cũ
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                // Retry request cũ
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token hết hạn hoặc thất bại -> Đăng xuất
                clearTokens();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;