"use client";

import Link from "next/link";
import { ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/features/catalog/catalog.hooks";
import { useAddToCart } from "@/features/cart/cart.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { formatCurrency } from "@/lib/format";

export default function Home() {
  const { data, isLoading } = useProducts({ limit: 8 });
  const addToCart = useAddToCart();
  const { isAdmin } = useCurrentRole();
  const products = data?.data.items ?? [];

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-14">
          <div className="flex flex-col justify-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Store className="h-4 w-4" />
              Ecommerce Store
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
                Mua sam nhanh, ton kho ro rang, dat hang COD.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                Danh sach san pham duoc lay truc tiep tu backend va gio hang gan voi tai khoan dang nhap.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">Xem san pham</Link>
              </Button>
              {!isAdmin && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/cart">Gio hang</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="min-h-[320px] overflow-hidden rounded-lg border bg-muted">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
              alt="Ecommerce checkout counter"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">San pham moi</h2>
            <p className="text-sm text-muted-foreground">Cac san pham dang mo ban.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">Tat ca</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-lg border bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-lg border bg-card">
                <Link href={`/products/${product.id}`} className="block aspect-[4/3] bg-muted">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </Link>
                <div className="space-y-3 p-4">
                  <Link href={`/products/${product.id}`} className="line-clamp-2 font-medium hover:underline">
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{formatCurrency(product.salePrice ?? product.price)}</div>
                      {product.salePrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.price)}
                        </div>
                      )}
                    </div>
                    {!isAdmin && (
                      <Button
                        size="sm"
                        disabled={product.stock <= 0 || addToCart.isPending}
                        onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                      >
                        Them
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
