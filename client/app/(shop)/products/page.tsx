"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories, useProducts } from "@/features/catalog/catalog.hooks";
import { useAddToCart } from "@/features/cart/cart.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { formatCurrency } from "@/lib/format";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const params = useMemo(
    () => ({ search: search || undefined, categoryId: categoryId || undefined, sort, limit: 24 }),
    [search, categoryId, sort]
  );
  const { data, isLoading } = useProducts(params);
  const { data: categories } = useCategories();
  const addToCart = useAddToCart();
  const { isAdmin } = useCurrentRole();
  const products = data?.data.items ?? [];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">San pham</h1>
          <p className="text-muted-foreground">Tim kiem, loc danh muc va them vao gio hang.</p>
        </div>
        {!isAdmin && (
          <Button asChild variant="outline">
            <Link href="/cart">Xem gio hang</Link>
          </Button>
        )}
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tim theo ten hoac SKU"
            className="pl-9"
          />
        </div>
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Tat ca danh muc</option>
          {(categories?.data ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="newest">Moi nhat</option>
          <option value="price_asc">Gia tang dan</option>
          <option value="price_desc">Gia giam dan</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      ) : products.length ? (
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
                <p className="text-xs text-muted-foreground">{product.category?.name ?? "Chua phan loai"}</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{formatCurrency(product.salePrice ?? product.price)}</div>
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
      ) : (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">Chua co san pham phu hop.</div>
      )}
    </main>
  );
}
