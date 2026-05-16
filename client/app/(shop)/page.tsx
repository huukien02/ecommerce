"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Truck, CreditCard, Shield, RotateCcw, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, useCategories } from "@/features/catalog/catalog.hooks";
import { useAddToCart } from "@/features/cart/cart.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { formatCurrency } from "@/lib/format";

const FEATURES = [
  { icon: Truck, title: "Giao hàng nhanh", desc: "Miễn phí vận chuyển đơn từ 500.000₫" },
  { icon: CreditCard, title: "Thanh toán COD", desc: "Nhận hàng rồi mới trả tiền" },
  { icon: Shield, title: "Bảo mật", desc: "Thông tin cá nhân được bảo vệ" },
  { icon: RotateCcw, title: "Đổi trả dễ dàng", desc: "Hỗ trợ đổi trả trong 7 ngày" },
];

export default function Home() {
  const { data, isLoading } = useProducts({ limit: 8 });
  const { data: categoriesData } = useCategories();
  const addToCart = useAddToCart();
  const { isAdmin } = useCurrentRole();

  const products = data?.data.items ?? [];
  const categories = categoriesData?.data ?? [];

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24 lg:py-32">
          {/* text */}
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Tag className="h-3 w-3" />
              Ưu đãi mỗi ngày
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Mua sắm{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                thông minh
              </span>
              ,<br />giao hàng{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                tận nơi
              </span>
            </h1>

            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              Hàng nghìn sản phẩm chính hãng, giá tốt mỗi ngày. Đặt hàng COD — nhận hàng rồi mới thanh toán.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                <Link href="/products">
                  Mua sắm ngay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {!isAdmin && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/cart">Xem giỏ hàng</Link>
                </Button>
              )}
            </div>
          </div>

          {/* image */}
          <div className="relative hidden overflow-hidden rounded-2xl border bg-muted md:block">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80"
              alt="Mua sắm trực tuyến"
              className="h-full w-full object-cover opacity-90 dark:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />

            {/* floating card */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl border bg-background/90 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Đơn hàng hôm nay</p>
                <p className="text-sm font-semibold">Giao trong 2–4 giờ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0 px-0">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 px-6 py-5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Danh mục</h2>
            <Link href="/products" className="flex items-center gap-1 text-sm text-primary hover:underline">
              Tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8" id="products">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm nổi bật</h2>
            <p className="text-sm text-muted-foreground">Các sản phẩm bán chạy đang mở bán.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products" className="gap-1">
              Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl border bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
              >
                {/* image */}
                <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  {/* sale badge */}
                  {product.salePrice && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      Giảm giá
                    </span>
                  )}
                  {/* out of stock overlay */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                      <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </Link>

                {/* info */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex-1">
                    {product.category && (
                      <p className="mb-1 text-xs text-muted-foreground">{product.category.name}</p>
                    )}
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="font-bold text-primary">
                        {formatCurrency(product.salePrice ?? product.price)}
                      </p>
                      {product.salePrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>
                    {!isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 gap-1.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                        disabled={product.stock <= 0 || addToCart.isPending}
                        onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Thêm
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="border-t bg-muted/40">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 overflow-hidden px-4 py-14 text-center md:px-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Khám phá hàng nghìn sản phẩm
          </h2>
          <p className="max-w-md text-muted-foreground">
            Từ điện tử, thời trang đến gia dụng — tất cả trong một cửa hàng.
          </p>
          <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
            <Link href="/products">
              Xem tất cả sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
