import { AppFooter } from "@/components/layout/AppFooter";
import { ShopHeader } from "@/components/layout/ShopHeader";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ShopHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
