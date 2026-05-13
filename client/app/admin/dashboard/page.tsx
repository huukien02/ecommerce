"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminOrders, useAdminProducts, useAdminUsers } from "@/features/admin/admin.hooks";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboardPage() {
  const { data: products } = useAdminProducts();
  const { data: orders } = useAdminOrders();
  const { data: users } = useAdminUsers();

  const orderList = orders?.data ?? [];
  const revenue = orderList
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Operational overview for the store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{products?.data.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{orderList.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{users?.data.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{formatCurrency(revenue)}</CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h2 className="font-semibold">Recent orders</h2>
        </div>
        <div className="divide-y">
          {orderList.slice(0, 6).map((order) => (
            <div key={order.id} className="grid gap-2 p-4 md:grid-cols-[1fr_140px_160px]">
              <div>
                <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                <div className="text-sm text-muted-foreground">{order.customerName}</div>
              </div>
              <div className="text-sm">{order.status}</div>
              <div className="font-semibold md:text-right">{formatCurrency(order.total)}</div>
            </div>
          ))}
          {!orderList.length && <div className="p-4 text-sm text-muted-foreground">No orders yet.</div>}
        </div>
      </div>
    </div>
  );
}
