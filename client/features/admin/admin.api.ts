import api from "@/lib/axios";
import {
  AdminProductListResponse,
  CategoryPayload,
  CategoryResponse,
  OrderListResponse,
  OrderResponse,
  ProductPayload,
  ProductResponse,
  UserListResponse,
} from "./admin.types";

export const adminApi = {
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

  products: async (): Promise<AdminProductListResponse> => {
    const res = await api.get("/products", { params: { limit: 100 } });
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

  orders: async (): Promise<OrderListResponse> => {
    const res = await api.get("/orders");
    return res.data;
  },
  updateOrderStatus: async (
    id: string,
    status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled"
  ): Promise<OrderResponse> => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },

  users: async (): Promise<UserListResponse> => {
    const res = await api.get("/users", { params: { limit: 100 } });
    return res.data;
  },
};
