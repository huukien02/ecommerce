import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
                    {children}
                </main>
                <AppFooter />
            </SidebarInset>
        </SidebarProvider>
    );
}
