"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bell, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMe } from "@/features/auth/auth.hooks";

export function AppHeader() {
  const { data: meData } = useMe();
  const adminName = meData?.data?.name;

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4 md:px-6">
        <SidebarTrigger className="mr-4" />

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <Store className="mr-1 h-4 w-4" />
              Cửa hàng
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <ThemeToggle />

          {adminName && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
              <div className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium max-w-28 truncate">{adminName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
