"use client";

import { useAdminOrders, useUpdateOrderStatus } from "@/features/admin/admin.hooks";
import { formatCurrency } from "@/lib/format";

const statuses = ["pending", "confirmed", "shipping", "completed", "cancelled"] as const;

export default function AdminOrdersPage() {
  const { data, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Review orders and update fulfillment status.</p>
      </div>

      <section className="overflow-hidden rounded-lg border">
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-3">
                    <div className="font-medium">#{order.id.slice(0, 8)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">{order.phone}</div>
                    <div className="max-w-xs truncate text-xs text-muted-foreground">{order.address}</div>
                  </td>
                  <td className="p-3">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.productName} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">
                    <div>{order.paymentMethod.toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">{order.paymentStatus}</div>
                  </td>
                  <td className="p-3 font-semibold">{formatCurrency(order.total)}</td>
                  <td className="p-3">
                    <select
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                      value={order.status}
                      disabled={updateStatus.isPending}
                      onChange={(event) =>
                        updateStatus.mutate({
                          id: order.id,
                          status: event.target.value as (typeof statuses)[number],
                        })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!orders.length && !isLoading && (
                <tr>
                  <td className="p-4 text-muted-foreground" colSpan={6}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
