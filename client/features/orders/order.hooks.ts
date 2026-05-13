import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { orderApi } from "./order.api";

export const useCheckout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Đặt hàng thành công");
      router.push("/orders");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể đặt hàng");
    },
  });
};

export const useMyOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.mine,
    retry: false,
  });
