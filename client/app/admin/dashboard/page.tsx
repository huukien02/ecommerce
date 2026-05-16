"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminOrders, useAdminProducts, useAdminUsers } from "@/features/admin/admin.hooks";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboardPage() {
  const { data: products } = useAdminProducts();
  const { data: orders } = useAdminOrders();
  const { data: users } = useAdminUsers();

  const orderList = orders?.data?.items ?? [];
  const revenue = orderList
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều hành</h1>
        <p className="text-muted-foreground">Tổng quan hoạt động của cửa hàng.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{products?.data.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{orders?.data?.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Người dùng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{users?.data.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Doanh thu hoàn thành</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{formatCurrency(revenue)}</CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h2 className="font-semibold">Đơn hàng gần đây</h2>
        </div>
        <div className="divide-y">
          {orderList.slice(0, 6).map((order) => (
            <div key={order.id} className="grid gap-2 p-4 md:grid-cols-[1fr_140px_160px]">
              <div>
                <div className="font-medium">Đơn #{order.id.slice(0, 8)}</div>
                <div className="text-sm text-muted-foreground">{order.customerName}</div>
              </div>
              <div className="text-sm">{order.status}</div>
              <div className="font-semibold md:text-right">{formatCurrency(order.total)}</div>
            </div>
          ))}
          {!orderList.length && (
            <div className="p-4 text-sm text-muted-foreground">Chưa có đơn hàng nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}
