"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authApi } from "@/features/auth/auth.api";
import { getAccessToken } from "@/lib/token";

export function ShopShell({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setChecked(true);
      return;
    }

    authApi
      .me()
      .then((res) => setRole(res.data.role ?? null))
      .catch(() => setRole(null))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader showSidebarTrigger={false} />
        <div className="border-b bg-muted/40 px-4 py-2 md:px-6">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/dashboard">Back to admin</Link>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        <AppFooter />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-y-auto bg-background">{children}</div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
