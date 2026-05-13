import { ApiResponse } from "@/features/auth/auth.types";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface Order {
  id: string;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;
  items: OrderItem[];
  createdAt: string;
}

export type OrderResponse = ApiResponse<Order>;
export type OrderListResponse = ApiResponse<Order[]>;
