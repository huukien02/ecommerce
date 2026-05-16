"use client";

import { useState } from "react";
import Link from "next/link";
import AuthGuard from "@/features/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/cart.hooks";
import { useCheckout } from "@/features/orders/order.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const { data } = useCart();
  const checkout = useCheckout();
  const { isAdmin } = useCurrentRole();
  const cart = data?.data;
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
  });

  const shippingFee = cart && cart.subtotal >= 500000 ? 0 : 30000;
  const total = (cart?.subtotal ?? 0) + shippingFee;

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-8">
        {isAdmin ? (
          <div className="rounded-lg border p-10 text-center">
            <h1 className="mb-2 text-2xl font-semibold">Admin không thể thanh toán</h1>
            <p className="mb-4 text-muted-foreground">Admin quản lý đơn hàng của khách từ trang quản trị đơn hàng.</p>
            <Button asChild>
              <Link href="/admin/orders">Quản lý đơn hàng</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Thanh toán</h1>
              <p className="text-muted-foreground">Thanh toán COD cho đơn hàng hiện tại.</p>
            </div>

            {!cart?.items.length ? (
              <div className="rounded-lg border p-10 text-center">
                <p className="mb-4 text-muted-foreground">Giỏ hàng đang trống.</p>
                <Button asChild>
                  <Link href="/products">Xem sản phẩm</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <form
                  onSubmit={(e) => { e.preventDefault(); checkout.mutate({ ...form, paymentMethod: "cod" }); }}
                  className="space-y-4 rounded-lg border p-5"
                >
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Họ tên</label>
                    <Input
                      value={form.customerName}
                      onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="0901234567"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Địa chỉ giao hàng</label>
                    <Textarea
                      value={form.address}
                      onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Ghi chú</label>
                    <Textarea
                      value={form.note}
                      onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="Ghi chú cho người giao hàng (tuỳ chọn)"
                    />
                  </div>
                  <Button type="submit" disabled={checkout.isPending} className="w-full">
                    {checkout.isPending ? "Đang đặt hàng..." : "Đặt hàng COD"}
                  </Button>
                </form>

                <aside className="h-fit rounded-lg border p-5">
                  <h2 className="mb-4 text-lg font-semibold">Tóm tắt đơn hàng</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sản phẩm</span>
                      <span>{formatCurrency(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 text-base font-semibold">
                      <span>Tổng cộng</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  {cart.subtotal < 500000 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Mua thêm {formatCurrency(500000 - cart.subtotal)} để được miễn phí vận chuyển.
                    </p>
                  )}
                </aside>
              </div>
            )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
