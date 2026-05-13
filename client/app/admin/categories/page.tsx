"use client";

import { FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/features/catalog/catalog.hooks";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/features/admin/admin.hooks";
import { Category } from "@/features/catalog/catalog.types";

const blank = { name: "", description: "" };

export default function AdminCategoriesPage() {
  const { data } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(blank);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (editing) {
      updateCategory.mutate({ id: editing.id, data: form });
    } else {
      createCategory.mutate(form);
    }
    setEditing(null);
    setForm(blank);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={onSubmit} className="h-fit space-y-4 rounded-lg border p-4">
        <h1 className="text-xl font-semibold">{editing ? "Edit category" : "Create category"}</h1>
        <Input
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Name"
          required
        />
        <Input
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Description"
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
            {editing ? "Save" : "Create"}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <section className="rounded-lg border">
        <div className="border-b p-4">
          <h2 className="font-semibold">Categories</h2>
        </div>
        <div className="divide-y">
          {(data?.data ?? []).map((category) => (
            <div key={category.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto]">
              <div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground">{category.description || "No description"}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditing(category);
                    setForm({ name: category.name, description: category.description ?? "" });
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteCategory.mutate(category.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
