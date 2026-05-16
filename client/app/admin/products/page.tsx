"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { useCategories } from "@/features/catalog/catalog.hooks";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/features/admin/admin.hooks";
import { ProductFilters } from "@/features/admin/admin.api";
import { Product } from "@/features/catalog/catalog.types";
import { ProductPayload } from "@/features/admin/admin.types";
import { formatCurrency } from "@/lib/format";
import { ProductModal } from "@/components/admin/ProductModal";
import { SelectInput } from "@/components/form/SelectField";

const STATUS_LABEL: Record<string, string> = {
  active: "Đang bán",
  draft: "Nháp",
  out_of_stock: "Hết hàng",
};

const STATUS_CLASS: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  out_of_stock: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({ status: "all" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data: productsRes, isLoading } = useAdminProducts(page, search, filters);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const items = productsRes?.data.items ?? [];
  const total = productsRes?.data.total ?? 0;
  const limit = productsRes?.data.limit ?? 10;
  const categoryList = categories?.data ?? [];

  const setFilter = (field: Partial<ProductFilters>) => {
    setFilters((p) => ({ ...p, ...field }));
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleSubmit = (data: ProductPayload) => {
    if (editing) {
      updateProduct.mutate({ id: editing.id, data }, { onSuccess: () => setModalOpen(false) });
    } else {
      createProduct.mutate(data, { onSuccess: () => setModalOpen(false) });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      key: "name",
      label: "Sản phẩm",
      render: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.category?.name ?? "Chưa phân loại"}</div>
        </div>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      render: (row) => <span className="font-mono text-xs">{row.sku}</span>,
    },
    {
      key: "price",
      label: "Giá",
      render: (row) => (
        <div>
          <div className="font-medium">{formatCurrency(row.salePrice ?? row.price)}</div>
          {row.salePrice && (
            <div className="text-xs text-muted-foreground line-through">{formatCurrency(row.price)}</div>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Tồn kho",
      render: (row) => (
        <span className={row.stock === 0 ? "font-medium text-destructive" : ""}>{row.stock}</span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[row.status] ?? ""}`}>
          {STATUS_LABEL[row.status] ?? row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => openEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm.</p>
        </div>

        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(row) => row.id}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(p) => setPage(p)}
          isLoading={isLoading}
          emptyText="Không tìm thấy sản phẩm nào."
          title="Danh sách sản phẩm"
          searchValue={search}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Tìm theo tên, SKU..."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <SelectInput
                className="h-9 text-sm"
                value={filters.categoryId ?? ""}
                onChange={(v) => setFilter({ categoryId: v || undefined })}
                options={[
                  { value: "", label: "Tất cả danh mục" },
                  ...categoryList.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />

              <SelectInput
                className="h-9 text-sm"
                value={filters.status ?? "all"}
                onChange={(v) => setFilter({ status: v as ProductFilters["status"] })}
                options={[
                  { value: "all", label: "Tất cả trạng thái" },
                  { value: "active", label: "Đang bán" },
                  { value: "draft", label: "Nháp" },
                  { value: "out_of_stock", label: "Hết hàng" },
                ]}
              />

              <SelectInput
                className="h-9 text-sm"
                value={filters.sort ?? ""}
                onChange={(v) => setFilter({ sort: (v || undefined) as ProductFilters["sort"] })}
                options={[
                  { value: "", label: "Mới nhất" },
                  { value: "price_asc", label: "Giá tăng dần" },
                  { value: "price_desc", label: "Giá giảm dần" },
                ]}
              />

              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-1 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          }
        />
      </div>

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        categories={categoryList}
        isPending={createProduct.isPending || updateProduct.isPending}
        onSubmit={handleSubmit}
      />
    </>
  );
}
