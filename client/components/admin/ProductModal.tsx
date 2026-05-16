"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import BaseForm from "@/components/form/BaseForm";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import TextareaField from "@/components/form/TextareaField";
import { Category, Product } from "@/features/catalog/catalog.types";
import { ProductPayload } from "@/features/admin/admin.types";

const schema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  sku: z.string().min(1, "SKU không được để trống"),
  price: z
    .string()
    .min(1, "Nhập giá gốc")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Giá phải lớn hơn 0"),
  salePrice: z.string().optional(),
  stock: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Tồn kho không được âm"),
  imageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["active", "draft", "out_of_stock"]),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof schema>;

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Product | null;
  categories: Category[];
  isPending: boolean;
  onSubmit: (data: ProductPayload) => void;
}

export function ProductModal({
  open,
  onOpenChange,
  editing,
  categories,
  isPending,
  onSubmit,
}: ProductModalProps) {
  const defaultValues: ProductFormData = editing
    ? {
        name: editing.name,
        sku: editing.sku,
        price: String(Number(editing.price)),
        salePrice: editing.salePrice ? String(Number(editing.salePrice)) : "",
        stock: String(editing.stock),
        imageUrl: editing.imageUrl ?? "",
        categoryId: editing.category?.id ?? "",
        status: editing.status as "active" | "draft" | "out_of_stock",
        description: editing.description ?? "",
      }
    : {
        name: "",
        sku: "",
        price: "",
        salePrice: "",
        stock: "0",
        imageUrl: "",
        categoryId: "",
        status: "active",
        description: "",
      };

  const handleSubmit = (data: ProductFormData) => {
    onSubmit({
      name: data.name,
      sku: data.sku,
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      stock: Number(data.stock),
      imageUrl: data.imageUrl || undefined,
      categoryId: data.categoryId || null,
      status: data.status,
      description: data.description || undefined,
    });
  };

  const categoryOptions = [
    { value: "", label: "Chưa phân loại" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const statusOptions = [
    { value: "active", label: "Đang bán" },
    { value: "draft", label: "Nháp" },
    { value: "out_of_stock", label: "Hết hàng" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
        </DialogHeader>

        <BaseForm
          key={editing?.id ?? "new"}
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <InputField name="name" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField name="sku" label="SKU" placeholder="Mã SKU" />
            <InputField name="stock" label="Tồn kho" type="number" placeholder="0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField name="price" label="Giá gốc" type="number" placeholder="0" />
            <InputField name="salePrice" label="Giá khuyến mãi" type="number" placeholder="Để trống nếu không có" />
          </div>
          <InputField name="imageUrl" label="URL ảnh" placeholder="https://..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField name="categoryId" label="Danh mục" options={categoryOptions} placeholder="Chọn danh mục" />
            <SelectField name="status" label="Trạng thái" options={statusOptions} placeholder="Chọn trạng thái" />
          </div>
          <TextareaField name="description" label="Mô tả" placeholder="Mô tả sản phẩm..." rows={3} />

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {editing ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </BaseForm>
      </DialogContent>
    </Dialog>
  );
}
