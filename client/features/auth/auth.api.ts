import api from "@/lib/axios";
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    MeResponse,
} from "./auth.types";

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await api.post("/auth/login", data);
        return res.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const res = await api.post("/auth/register", data);
        return res.data;
    },

    logout: async () => {
        const res = await api.post("/auth/logout");
        return res.data;
    },

    me: async (): Promise<MeResponse> => {
        const res = await api.get("/auth/me");
        return res.data;
    },
};