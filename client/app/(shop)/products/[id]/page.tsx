"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/features/catalog/catalog.hooks";
import { useAddToCart } from "@/features/cart/cart.hooks";
import { useCurrentRole } from "@/features/auth/use-current-role";
import { formatCurrency } from "@/lib/format";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useProduct(params.id);
  const addToCart = useAddToCart();
  const { isAdmin } = useCurrentRole();
  const product = data?.data;

  if (isLoading) {
    return <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">Dang tai...</main>;
  }

  if (!product) {
    return <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">Khong tim thay san pham.</main>;
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 md:grid-cols-2 md:px-8">
      <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <section className="space-y-6">
        <div className="space-y-2">
          <Link href="/products" className="text-sm text-muted-foreground hover:underline">
            San pham
          </Link>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
        </div>

        <div>
          <div className="text-3xl font-semibold">{formatCurrency(product.salePrice ?? product.price)}</div>
          {product.salePrice && (
            <div className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</div>
          )}
        </div>

        <div className="rounded-lg border p-4 text-sm">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Danh muc</span>
            <span>{product.category?.name ?? "Chua phan loai"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Ton kho</span>
            <span>{product.stock}</span>
          </div>
        </div>

        {product.description && <p className="leading-7 text-muted-foreground">{product.description}</p>}

        {!isAdmin && (
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              disabled={product.stock <= 0 || addToCart.isPending}
              onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
            >
              Them vao gio
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cart">Di toi gio hang</Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
