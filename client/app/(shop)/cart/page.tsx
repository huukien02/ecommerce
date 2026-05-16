"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import AuthGuard from "@/features/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/features/cart/cart.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const { isAdmin } = useCurrentRole();
  const cart = data?.data;

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-8">
        {isAdmin ? (
          <div className="rounded-lg border p-10 text-center">
            <h1 className="mb-2 text-2xl font-semibold">Admin không thể đặt hàng</h1>
            <p className="mb-4 text-muted-foreground">Sử dụng trang quản trị để quản lý sản phẩm, danh mục, đơn hàng và người dùng.</p>
            <Button asChild>
              <Link href="/admin/dashboard">Đến trang quản trị</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng</h1>
                <p className="text-muted-foreground">Kiểm tra sản phẩm trước khi thanh toán.</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/products">Tiếp tục mua</Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="h-48 animate-pulse rounded-lg border bg-muted" />
            ) : !cart?.items.length ? (
              <div className="rounded-lg border p-10 text-center">
                <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">Giỏ hàng đang trống.</p>
                <Button asChild>
                  <Link href="/products">Xem sản phẩm</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[96px_1fr_auto]">
                      <div className="aspect-square overflow-hidden rounded-md bg-muted">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="space-y-1">
                        <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                        <p className="font-semibold">{formatCurrency(item.unitPrice)}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <div className="flex h-9 items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={item.quantity <= 1 || updateItem.isPending}
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={updateItem.isPending}
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={removeItem.isPending}
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="font-semibold">{formatCurrency(item.lineTotal)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="h-fit rounded-lg border p-5">
                  <h2 className="mb-4 text-lg font-semibold">Tổng đơn</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số lượng</span>
                      <span>{cart.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatCurrency(cart.subtotal)}</span>
                    </div>
                  </div>
                  <Button asChild className="mt-5 w-full">
                    <Link href="/checkout">Thanh toán</Link>
                  </Button>
                </aside>
              </div>
            )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
