"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "./auth.hooks";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useMe();
  const router = useRouter();
  const role = data?.data?.role;

  useEffect(() => {
    if (isError) router.push("/login");
    if (!isLoading && role && role !== "admin") router.push("/");
  }, [isError, isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  if (role !== "admin") return null;

  return <>{children}</>;
}
