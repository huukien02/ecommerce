import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearTokens, setTokens } from "@/lib/token";
import { authApi } from "./auth.api";
import { LoginRequest, RegisterRequest } from "./auth.types";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (res) => {
      if (res.data?.access_token) {
        setTokens(res.data.access_token, res.data.refresh_token);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        const me = await authApi.me();
        toast.success("Login successful");
        router.push(me.data.role === "admin" ? "/admin/dashboard" : "/profile");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast.success("Register successful. Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Register failed");
    },
  });
};

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  });

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      toast.success("Logged out");
      router.push("/login");
    },
    onError: () => {
      clearTokens();
      queryClient.clear();
      toast.error("Logged out");
      router.push("/login");
    },
  });
};
