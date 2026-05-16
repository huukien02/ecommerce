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
import TextareaField from "@/components/form/TextareaField";
import { Category } from "@/features/catalog/catalog.types";
import { CategoryPayload } from "@/features/admin/admin.types";

const schema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof schema>;

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Category | null;
  isPending: boolean;
  onSubmit: (data: CategoryPayload) => void;
}

export function CategoryModal({
  open,
  onOpenChange,
  editing,
  isPending,
  onSubmit,
}: CategoryModalProps) {
  const defaultValues: CategoryFormData = {
    name: editing?.name ?? "",
    description: editing?.description ?? "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
        </DialogHeader>

        <BaseForm
          key={editing?.id ?? "new"}
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={(data) =>
            onSubmit({ name: data.name, description: data.description })
          }
          className="space-y-4"
        >
          <InputField name="name" label="Tên danh mục" placeholder="Nhập tên danh mục" />
          <TextareaField name="description" label="Mô tả" placeholder="Mô tả danh mục..." rows={3} />

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
