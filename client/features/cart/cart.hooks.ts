import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "./cart.api";

export const useCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    retry: false,
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã thêm vào giỏ hàng");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể thêm vào giỏ hàng");
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.update(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};
