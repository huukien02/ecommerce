"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/admin/admin.hooks";
import { User } from "@/features/auth/auth.types";
import { CreateUserPayload, UpdateUserPayload } from "@/features/admin/admin.types";
import { UserModal } from "@/components/admin/UserModal";

const ROLE_LABEL: Record<string, string> = {
  admin: "Quản trị",
  user: "Người dùng",
};

const ROLE_CLASS: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const { data, isLoading } = useAdminUsers(page, search);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const items = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const limit = data?.data?.limit ?? 10;

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setModalOpen(true);
  };

  const handleCreate = (data: CreateUserPayload) => {
    createUser.mutate(data, { onSuccess: () => setModalOpen(false) });
  };

  const handleUpdate = (data: UpdateUserPayload) => {
    if (!editing?.sub) return;
    updateUser.mutate({ id: editing.sub, data }, { onSuccess: () => setModalOpen(false) });
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Họ tên",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {row.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="text-muted-foreground">{row.email}</span>,
    },
    {
      key: "role",
      label: "Vai trò",
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_CLASS[row.role ?? ""] ?? ""}`}>
          {ROLE_LABEL[row.role ?? ""] ?? row.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          row.isActive !== false
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {row.isActive !== false ? "Hoạt động" : "Đã khóa"}
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
          <Button variant="ghost" size="icon" onClick={() => deleteUser.mutate(row.sub)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
          <p className="text-muted-foreground">Quản lý tài khoản người dùng.</p>
        </div>

        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(row) => row.sub ?? row.email}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyText="Không tìm thấy người dùng nào."
          title="Danh sách người dùng"
          searchValue={search}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Tìm theo tên, email..."
          actions={
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" />
              Thêm tài khoản
            </Button>
          }
        />
      </div>

      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        isPending={createUser.isPending || updateUser.isPending}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}
