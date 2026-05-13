import { ApiResponse } from "@/features/auth/auth.types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  salePrice?: string;
  sku: string;
  stock: number;
  imageUrl?: string;
  status: "active" | "draft" | "out_of_stock";
  category?: Category;
}

export interface ProductList {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ProductListResponse = ApiResponse<ProductList>;
export type ProductResponse = ApiResponse<Product>;
export type CategoryListResponse = ApiResponse<Category[]>;
