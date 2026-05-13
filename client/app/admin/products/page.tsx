"use client";

import { FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/catalog/catalog.hooks";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/features/admin/admin.hooks";
import { Product } from "@/features/catalog/catalog.types";
import { ProductPayload } from "@/features/admin/admin.types";
import { formatCurrency } from "@/lib/format";

type ProductForm = Omit<ProductPayload, "price" | "salePrice" | "stock"> & {
  price: string;
  salePrice: string;
  stock: string;
};

const blank: ProductForm = {
  name: "",
  description: "",
  price: "",
  salePrice: "",
  sku: "",
  stock: "0",
  imageUrl: "",
  status: "active",
  categoryId: "",
};

const toPayload = (form: ProductForm): ProductPayload => ({
  name: form.name,
  description: form.description || undefined,
  price: Number(form.price),
  salePrice: form.salePrice ? Number(form.salePrice) : undefined,
  sku: form.sku,
  stock: Number(form.stock),
  imageUrl: form.imageUrl || undefined,
  status: form.status,
  categoryId: form.categoryId || null,
});

const fromProduct = (product: Product): ProductForm => ({
  name: product.name,
  description: product.description ?? "",
  price: String(Number(product.price)),
  salePrice: product.salePrice ? String(Number(product.salePrice)) : "",
  sku: product.sku,
  stock: String(product.stock),
  imageUrl: product.imageUrl ?? "",
  status: product.status,
  categoryId: product.category?.id ?? "",
});

export default function AdminProductsPage() {
  const { data: products } = useAdminProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(blank);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = toPayload(form);
    if (editing) updateProduct.mutate({ id: editing.id, data: payload });
    else createProduct.mutate(payload);
    setEditing(null);
    setForm(blank);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={onSubmit} className="h-fit space-y-4 rounded-lg border p-4">
        <h1 className="text-xl font-semibold">{editing ? "Edit product" : "Create product"}</h1>
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} required />
          <Input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
          <Input placeholder="Sale price" type="number" value={form.salePrice} onChange={(e) => setForm((p) => ({ ...p, salePrice: e.target.value }))} />
        </div>
        <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={form.categoryId ?? ""} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
            <option value="">No category</option>
            {(categories?.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ProductPayload["status"] }))}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </div>
        <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <div className="flex gap-2">
          <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
            {editing ? "Save" : "Create"}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(blank); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <section className="overflow-hidden rounded-lg border">
        <div className="border-b p-4">
          <h2 className="font-semibold">Products</h2>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(products?.data.items ?? []).map((product) => (
                <tr key={product.id}>
                  <td className="p-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category?.name ?? "No category"}</div>
                  </td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{formatCurrency(product.salePrice ?? product.price)}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.status}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditing(product); setForm(fromProduct(product)); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
