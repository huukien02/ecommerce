"use client";

import AuthGuard from "@/features/auth/AuthGuard";
import { useMyOrders } from "@/features/orders/order.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function OrdersPage() {
  const { data, isLoading } = useMyOrders();
  const { isAdmin } = useCurrentRole();
  const orders = data?.data ?? [];

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-8">
        {isAdmin ? (
          <div className="rounded-lg border p-10 text-center">
            <h1 className="mb-2 text-2xl font-semibold">Admin không có đơn hàng cá nhân</h1>
            <p className="mb-4 text-muted-foreground">Sử dụng trang quản trị để xem và quản lý tất cả đơn hàng.</p>
            <Button asChild>
              <Link href="/admin/orders">Quản lý đơn hàng</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Đơn hàng của tôi</h1>
              <p className="text-muted-foreground">Theo dõi lịch sử đơn hàng và trạng thái xử lý.</p>
            </div>

            {isLoading ? (
              <div className="h-48 animate-pulse rounded-lg border bg-muted" />
            ) : orders.length ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-lg border p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-semibold">Đơn #{order.id.slice(0, 8)}</h2>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="rounded-md border px-2 py-1">
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-4 text-sm">
                          <span>{item.productName} x {item.quantity}</span>
                          <span>{formatCurrency(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                      <span>Tổng cộng</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border p-10 text-center text-muted-foreground">
                Bạn chưa có đơn hàng nào.
              </div>
            )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
