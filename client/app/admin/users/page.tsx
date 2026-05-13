"use client";

import { useAdminUsers } from "@/features/admin/admin.hooks";

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminUsers();
  const users = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">View registered users and roles.</p>
      </div>

      <section className="overflow-hidden rounded-lg border">
        <div className="overflow-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.sub || user.email}>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">active</td>
                </tr>
              ))}
              {!users.length && !isLoading && (
                <tr>
                  <td className="p-4 text-muted-foreground" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
