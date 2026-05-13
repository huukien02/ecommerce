import api from "@/lib/axios";
import { CartResponse } from "./cart.types";

export const cartApi = {
  get: async (): Promise<CartResponse> => {
    const res = await api.get("/cart");
    return res.data;
  },

  add: async (data: { productId: string; quantity: number }): Promise<CartResponse> => {
    const res = await api.post("/cart/items", data);
    return res.data;
  },

  update: async (itemId: string, quantity: number): Promise<CartResponse> => {
    const res = await api.patch(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  remove: async (itemId: string): Promise<CartResponse> => {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },
};
