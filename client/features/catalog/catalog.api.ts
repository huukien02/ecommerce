import api from "@/lib/axios";
import {
  CategoryListResponse,
  ProductListResponse,
  ProductResponse,
} from "./catalog.types";

export const catalogApi = {
  products: async (params?: {
    search?: string;
    categoryId?: string;
    sort?: "newest" | "price_asc" | "price_desc";
    page?: number;
    limit?: number;
  }): Promise<ProductListResponse> => {
    const res = await api.get("/products", { params });
    return res.data;
  },

  product: async (id: string): Promise<ProductResponse> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  categories: async (): Promise<CategoryListResponse> => {
    const res = await api.get("/categories");
    return res.data;
  },
};
