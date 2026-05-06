"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import QueryProvider from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                <QueryProvider>
                    {children}
                    <Toaster />
                </QueryProvider>
            </TooltipProvider>
        </NextThemesProvider>
    );
}