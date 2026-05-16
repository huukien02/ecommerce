"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { useAdminOrders, useUpdateOrderStatus } from "@/features/admin/admin.hooks";
import { Order } from "@/features/orders/order.types";
import { formatCurrency } from "@/lib/format";
import { SelectInput } from "@/components/form/SelectField";

const STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"] as const;
type OrderStatus = (typeof STATUSES)[number];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminOrders(page, search);
  const updateStatus = useUpdateOrderStatus();

  const items = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const limit = data?.data?.limit ?? 10;

  const columns: ColumnDef<Order>[] = [
    {
      key: "id",
      label: "Đơn hàng",
      render: (row) => (
        <div>
          <div className="font-mono font-medium">#{row.id.slice(0, 8)}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleString("vi-VN")}
          </div>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Khách hàng",
      render: (row) => (
        <div>
          <div className="font-medium">{row.customerName}</div>
          <div className="text-xs text-muted-foreground">{row.phone}</div>
          <div className="max-w-[180px] truncate text-xs text-muted-foreground">{row.address}</div>
        </div>
      ),
    },
    {
      key: "items",
      label: "Sản phẩm",
      render: (row) => (
        <div className="space-y-0.5">
          {row.items.map((item) => (
            <div key={item.id} className="text-sm">
              {item.productName} <span className="text-muted-foreground">x{item.quantity}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "payment",
      label: "Thanh toán",
      render: (row) => (
        <div>
          <div className="text-sm font-medium uppercase">{row.paymentMethod}</div>
          <div className="text-xs text-muted-foreground">{row.paymentStatus}</div>
        </div>
      ),
    },
    {
      key: "total",
      label: "Tổng tiền",
      render: (row) => <span className="font-semibold">{formatCurrency(row.total)}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <SelectInput
          className="h-8 text-xs"
          value={row.status}
          disabled={updateStatus.isPending}
          onChange={(v) =>
            updateStatus.mutate({ id: row.id, status: v as OrderStatus })
          }
          options={STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
        <p className="text-muted-foreground">Xem và cập nhật trạng thái đơn hàng.</p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(row) => row.id}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyText="Không tìm thấy đơn hàng nào."
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Tìm theo tên, SĐT, mã đơn..."
      />
    </div>
  );
}
