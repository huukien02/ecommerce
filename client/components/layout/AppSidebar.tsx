"use client";

import { Home, User, ShoppingBag, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Products", url: "/products", icon: ShoppingBag },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b dark:border-white/10 overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-12 md:p-2">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShoppingBag className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">
                  <span className="truncate font-bold text-lg">E-Commerce</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t dark:border-white/10">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
              V
            </div>
            <div className="text-xs text-muted-foreground truncate group-data-[collapsible=icon]:hidden">
              v1.0.0
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  );
}