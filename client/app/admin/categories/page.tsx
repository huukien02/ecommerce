"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { useCategories } from "@/features/catalog/catalog.hooks";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/features/admin/admin.hooks";
import { Category } from "@/features/catalog/catalog.types";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { CategoryPayload } from "@/features/admin/admin.types";

const PAGE_SIZE = 10;

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const allCategories = data?.data ?? [];
  const filtered = search
    ? allCategories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase()) ||
          (c.description ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : allCategories;

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const handleSubmit = (data: CategoryPayload) => {
    if (editing) {
      updateCategory.mutate({ id: editing.id, data }, { onSuccess: () => setModalOpen(false) });
    } else {
      createCategory.mutate(data, { onSuccess: () => setModalOpen(false) });
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      key: "name",
      label: "Tên danh mục",
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      cellClassName: "max-w-xs",
      render: (row) => (
        <span className="truncate text-sm text-muted-foreground">
          {row.description || "—"}
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
          <Button variant="ghost" size="icon" onClick={() => deleteCategory.mutate(row.id)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
          <p className="text-muted-foreground">Quản lý danh mục sản phẩm.</p>
        </div>

        <DataTable
          columns={columns}
          data={pageData}
          keyExtractor={(row) => row.id}
          total={filtered.length}
          page={page}
          limit={PAGE_SIZE}
          onPageChange={(p) => setPage(p)}
          isLoading={isLoading}
          emptyText="Không tìm thấy danh mục nào."
          title="Danh sách danh mục"
          searchValue={search}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Tìm theo tên, slug..."
          actions={
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" />
              Thêm danh mục
            </Button>
          }
        />
      </div>

      <CategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        isPending={createCategory.isPending || updateCategory.isPending}
        onSubmit={handleSubmit}
      />
    </>
  );
}
