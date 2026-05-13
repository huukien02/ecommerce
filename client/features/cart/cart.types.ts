import { ApiResponse } from "@/features/auth/auth.types";
import { Product } from "@/features/catalog/catalog.types";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

export type CartResponse = ApiResponse<Cart>;
