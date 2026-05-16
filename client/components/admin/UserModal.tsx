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
import { User } from "@/features/auth/auth.types";
import { CreateUserPayload, UpdateUserPayload } from "@/features/admin/admin.types";

const createSchema = z.object({
  name: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  role: z.enum(["user", "admin"]),
});

const editSchema = z.object({
  name: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự").or(z.literal("")),
  role: z.enum(["user", "admin"]),
});

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

const roleOptions = [
  { value: "user", label: "Người dùng" },
  { value: "admin", label: "Quản trị" },
];

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: User | null;
  isPending: boolean;
  onCreate: (data: CreateUserPayload) => void;
  onUpdate: (data: UpdateUserPayload) => void;
}

export function UserModal({
  open,
  onOpenChange,
  editing,
  isPending,
  onCreate,
  onUpdate,
}: UserModalProps) {
  const defaultValues: UserFormData = {
    name: editing?.name ?? "",
    email: editing?.email ?? "",
    password: "",
    role: (editing?.role as "user" | "admin") ?? "user",
  };

  const handleSubmit = (data: UserFormData) => {
    if (editing) {
      const payload: UpdateUserPayload = {
        name: data.name,
        email: data.email,
        role: data.role,
        ...(data.password && { password: data.password }),
      };
      onUpdate(payload);
    } else {
      onCreate({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Sửa tài khoản" : "Thêm tài khoản"}</DialogTitle>
        </DialogHeader>

        <BaseForm
          key={editing?.sub ?? "new"}
          schema={editing ? editSchema : createSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <InputField name="name" label="Họ tên" placeholder="Nguyễn Văn A" />
          <InputField name="email" label="Email" type="email" placeholder="email@example.com" />
          <InputField
            name="password"
            label={editing ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
            type="password"
            placeholder="••••••"
          />
          <SelectField name="role" label="Vai trò" options={roleOptions} />

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
