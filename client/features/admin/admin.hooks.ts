import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi, ProductFilters } from "./admin.api";
import { CategoryPayload, CreateUserPayload, ProductPayload, UpdateUserPayload } from "./admin.types";

// ── Products ──────────────────────────────────────────────────────────────────

export const useAdminProducts = (page = 1, search = "", filters: ProductFilters = {}) =>
  useQuery({
    queryKey: ["admin-products", page, search, filters],
    queryFn: () => adminApi.products(page, search, filters),
    placeholderData: (prev) => prev,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductPayload) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Tạo sản phẩm thành công");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Không thể tạo sản phẩm"),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductPayload> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật sản phẩm thành công");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Không thể cập nhật sản phẩm"),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Đã xóa sản phẩm");
    },
    onError: () => toast.error("Không thể xóa sản phẩm"),
  });
};

// ── Categories ────────────────────────────────────────────────────────────────

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryPayload) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Tạo danh mục thành công");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Không thể tạo danh mục"),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryPayload }) =>
      adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Cập nhật danh mục thành công");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Không thể cập nhật danh mục"),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Đã xóa danh mục");
    },
    onError: () => toast.error("Không thể xóa danh mục"),
  });
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const useAdminOrders = (page = 1, search = "") =>
  useQuery({
    queryKey: ["admin-orders", page, search],
    queryFn: () => adminApi.orders(page, search),
    placeholderData: (prev) => prev,
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
    }) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: () => toast.error("Không thể cập nhật trạng thái"),
  });
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const useAdminUsers = (page = 1, search = "") =>
  useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () => adminApi.users(page, search),
    placeholderData: (prev) => prev,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Tạo tài khoản thành công");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Không thể tạo tài khoản"),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Cập nhật tài khoản thành công");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Không thể cập nhật tài khoản"),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Đã xóa tài khoản");
    },
    onError: () => toast.error("Không thể xóa tài khoản"),
  });
};
