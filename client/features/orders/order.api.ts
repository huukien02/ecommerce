import api from "@/lib/axios";
import { OrderListResponse, OrderResponse } from "./order.types";

export const orderApi = {
  checkout: async (data: {
    customerName: string;
    phone: string;
    address: string;
    note?: string;
    paymentMethod: "cod";
  }): Promise<OrderResponse> => {
    const res = await api.post("/orders/checkout", data);
    return res.data;
  },

  mine: async (): Promise<OrderListResponse> => {
    const res = await api.get("/orders/mine");
    return res.data;
  },
};
