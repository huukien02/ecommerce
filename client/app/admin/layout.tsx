import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminGuard from "@/features/auth/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">{children}</main>
          <AppFooter />
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
