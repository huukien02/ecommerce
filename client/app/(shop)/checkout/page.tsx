"use client";

import { FormEvent, useState } from "react";
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

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    checkout.mutate({ ...form, paymentMethod: "cod" });
  };

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-8">
        {isAdmin ? (
          <div className="rounded-lg border p-10 text-center">
            <h1 className="mb-2 text-2xl font-semibold">Admin cannot checkout</h1>
            <p className="mb-4 text-muted-foreground">Admins manage customer orders from the admin orders page.</p>
            <Button asChild>
              <Link href="/admin/orders">Manage orders</Link>
            </Button>
          </div>
        ) : (
          <>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Thanh toan COD cho don hang hien tai.</p>
        </div>

        {!cart?.items.length ? (
          <div className="rounded-lg border p-10 text-center">
            <p className="mb-4 text-muted-foreground">Gio hang dang trong.</p>
            <Button asChild>
              <Link href="/products">Xem san pham</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-5">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ho ten</label>
                <Input
                  value={form.customerName}
                  onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">So dien thoai</label>
                <Input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Dia chi giao hang</label>
                <Textarea
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ghi chu</label>
                <Textarea
                  value={form.note}
                  onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                />
              </div>
              <Button type="submit" disabled={checkout.isPending} className="w-full">
                {checkout.isPending ? "Dang dat hang..." : "Dat hang COD"}
              </Button>
            </form>

            <aside className="h-fit rounded-lg border p-5">
              <h2 className="mb-4 text-lg font-semibold">Tom tat</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">San pham</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phi ship</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base font-semibold">
                  <span>Tong</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
