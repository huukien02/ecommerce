import { ApiResponse, User } from "@/features/auth/auth.types";
import { Category, Product, ProductList } from "@/features/catalog/catalog.types";
import { Order } from "@/features/orders/order.types";

export type CategoryPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
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

export type PaginatedList<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserList = PaginatedList<User>;
export type OrderList = PaginatedList<Order>;

export type CategoryResponse = ApiResponse<Category>;
export type ProductResponse = ApiResponse<Product>;
export type AdminProductListResponse = ApiResponse<ProductList>;
export type OrderListResponse = ApiResponse<OrderList>;
export type OrderResponse = ApiResponse<Order>;
export type UserListResponse = ApiResponse<UserList>;
