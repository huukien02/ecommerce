import api from "@/lib/axios";
import {
  AdminProductListResponse,
  CategoryPayload,
  CategoryResponse,
  CreateUserPayload,
  OrderListResponse,
  OrderResponse,
  ProductPayload,
  ProductResponse,
  UpdateUserPayload,
  UserListResponse,
} from "./admin.types";

const LIMIT = 10;

export type ProductFilters = {
  categoryId?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  status?: "active" | "draft" | "out_of_stock" | "all";
};

export const adminApi = {
  // ── Categories ──────────────────────────────────────────────────────────────
  createCategory: async (data: CategoryPayload): Promise<CategoryResponse> => {
    const res = await api.post("/categories", data);
    return res.data;
  },
  updateCategory: async (id: string, data: CategoryPayload): Promise<CategoryResponse> => {
    const res = await api.patch(`/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id: string) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },

  // ── Products ────────────────────────────────────────────────────────────────
  products: async (
    page = 1,
    search = "",
    filters: ProductFilters = {}
  ): Promise<AdminProductListResponse> => {
    const res = await api.get("/products", {
      params: {
        page,
        limit: LIMIT,
        status: filters.status ?? "all",
        ...(search && { search }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.sort && { sort: filters.sort }),
      },
    });
    return res.data;
  },
  createProduct: async (data: ProductPayload): Promise<ProductResponse> => {
    const res = await api.post("/products", data);
    return res.data;
  },
  updateProduct: async (id: string, data: Partial<ProductPayload>): Promise<ProductResponse> => {
    const res = await api.patch(`/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  // ── Orders ──────────────────────────────────────────────────────────────────
  orders: async (page = 1, search = ""): Promise<OrderListResponse> => {
    const res = await api.get("/orders", {
      params: { page, limit: LIMIT, ...(search && { search }) },
    });
    return res.data;
  },
  updateOrderStatus: async (
    id: string,
    status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled"
  ): Promise<OrderResponse> => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },

  // ── Users ───────────────────────────────────────────────────────────────────
  users: async (page = 1, search = ""): Promise<UserListResponse> => {
    const res = await api.get("/users", {
      params: { page, limit: LIMIT, ...(search && { search }) },
    });
    return res.data;
  },
  createUser: async (data: CreateUserPayload) => {
    const res = await api.post("/users", data);
    return res.data;
  },
  updateUser: async (id: string, data: UpdateUserPayload) => {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};
