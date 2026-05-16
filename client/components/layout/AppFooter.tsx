"use client";

import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="w-full border-t py-6 bg-background/50 backdrop-blur">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-10 md:flex-row md:py-0 px-4 md:px-6">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-primary">Cửa hàng</span>. Bảo lưu mọi quyền.
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Điều khoản</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
