"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "./auth.hooks";

function AuthLoading() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
    );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: meResponse, isLoading, isError } = useMe();
    const router = useRouter();

    useEffect(() => {
        if (isError) {
            router.push("/login");
        }
    }, [isError, router]);

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!meResponse?.data) {
        return null;
    }

    return <>{children}</>;
}
