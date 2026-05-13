import { ApiResponse, User } from "@/features/auth/auth.types";
import { Category, Product, ProductList } from "@/features/catalog/catalog.types";
import { Order } from "@/features/orders/order.types";

export type CategoryPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  imageUrl?: string;
  status?: "active" | "draft" | "out_of_stock";
  categoryId?: string | null;
};

export type UserList = {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CategoryResponse = ApiResponse<Category>;
export type ProductResponse = ApiResponse<Product>;
export type AdminProductListResponse = ApiResponse<ProductList>;
export type OrderListResponse = ApiResponse<Order[]>;
export type OrderResponse = ApiResponse<Order>;
export type UserListResponse = ApiResponse<UserList>;
