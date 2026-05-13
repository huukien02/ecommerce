"use client";

import AuthGuard from "@/features/auth/AuthGuard";
import { useMyOrders } from "@/features/orders/order.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

export default function OrdersPage() {
  const { data, isLoading } = useMyOrders();
  const { isAdmin } = useCurrentRole();
  const orders = data?.data ?? [];

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-8">
        {isAdmin ? (
          <div className="rounded-lg border p-10 text-center">
            <h1 className="mb-2 text-2xl font-semibold">Admin does not have personal orders</h1>
            <p className="mb-4 text-muted-foreground">Use the admin orders page to manage all customer orders.</p>
            <Button asChild>
              <Link href="/admin/orders">Manage orders</Link>
            </Button>
          </div>
        ) : (
          <>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Don hang cua toi</h1>
          <p className="text-muted-foreground">Theo doi lich su don hang va trang thai xu ly.</p>
        </div>

        {isLoading ? (
          <div className="h-48 animate-pulse rounded-lg border bg-muted" />
        ) : orders.length ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border p-5">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold">Don #{order.id.slice(0, 8)}</h2>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="rounded-md border px-2 py-1">{order.status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                  <span>Tong</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-10 text-center text-muted-foreground">Ban chua co don hang.</div>
        )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
