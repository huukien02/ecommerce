"use client";

import Link from "next/link";
import { ShoppingBag, ShoppingCart, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useMe, useLogout } from "@/features/auth/auth.hooks";
import { useCart } from "@/features/cart/cart.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";

export function ShopHeader() {
  const { data: meData } = useMe();
  const { mutate: logout, isPending } = useLogout();
  const { data: cartData } = useCart();
  const { isAdmin } = useCurrentRole();
  const user = meData?.data;
  const cartCount = cartData?.data?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingBag className="size-4" />
          </div>
          <span className="hidden sm:block">E-Commerce</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Trang chủ
          </Link>
          <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sản phẩm
          </Link>
          {user && !isAdmin && (
            <Link href="/orders" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Đơn hàng
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Giỏ hàng" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </Button>

          <ThemeToggle />

          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">
                  <User className="mr-1 h-4 w-4" />
                  <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Đăng xuất"
                onClick={() => logout()}
                disabled={isPending}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
