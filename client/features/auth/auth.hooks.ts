import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import {
    LoginRequest,
    RegisterRequest,
} from "./auth.types";
import { setTokens, clearTokens } from "@/lib/token";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// LOGIN
export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (res) => {
            if (res.data && res.data.access_token) {
                setTokens(res.data.access_token, res.data.refresh_token);
                queryClient.invalidateQueries({ queryKey: ["me"] });
                toast.success("Đăng nhập thành công!");
                router.push("/profile");
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
        }
    });
};

// REGISTER
export const useRegister = () => {
    const router = useRouter();
    
    return useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
        onSuccess: () => {
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            router.push("/login");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Đăng ký thất bại.");
        }
    });
};

// GET CURRENT USER
export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: authApi.me,
        retry: false,
    });
};

// LOGOUT
export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearTokens();
            queryClient.clear();
            toast.success("Đã đăng xuất an toàn.");
            router.push("/login");
        },
        onError: () => {
            clearTokens();
            queryClient.clear();
            toast.error("Đã đăng xuất.");
            router.push("/login");
        }
    });
};