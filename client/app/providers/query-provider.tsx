"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 0,          // luôn coi data là "cũ"
                        gcTime: 0,             // không giữ cache (React Query v5)
                        refetchOnMount: true,  // mount là fetch lại
                        refetchOnWindowFocus: true,
                        refetchOnReconnect: true,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}