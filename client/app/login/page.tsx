"use client";

import { useLogin } from "@/features/auth/auth.hooks";
import { loginSchema, LoginFormData } from "@/features/auth/auth.schema";
import BaseForm from "@/components/form/BaseForm";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    const { mutate, isPending } = useLogin();

    const onSubmit = (data: LoginFormData) => {
        mutate(data);
    };

    return (
        <div className="min-h-screen flex w-full bg-background">
            {/* Left side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 xl:px-48 relative z-10 bg-background/80 backdrop-blur-md">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="space-y-2 text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90 font-sans">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <BaseForm<LoginFormData>
                        schema={loginSchema}
                        defaultValues={{ email: "", password: "" }}
                        onSubmit={onSubmit}
                        className="space-y-6"
                    >
                        <InputField
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="user@example.com"
                            disabled={isPending}
                        />

                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            disabled={isPending}
                        />

                        <div className="flex items-center justify-between">
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-all"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-lg h-11"
                            disabled={isPending}
                        >
                            {isPending ? "Signing in..." : "Sign in"}
                        </Button>
                    </BaseForm>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline transition-all"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right side: Abstract Art */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-950 items-center justify-center">
                {/* Dynamic gradient blobs */}
                <div className="absolute w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-2xl -top-20 -right-20 animate-pulse"></div>
                <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-2xl bottom-0 -left-20 mix-blend-screen"></div>
                <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-lg text-center p-8 glassmorphism rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Discover amazing products
                    </h2>
                    <p className="text-zinc-300 text-lg">
                        Join our ecommerce platform today and unlock exclusive deals and a seamless shopping experience.
                    </p>
                </div>
            </div>
        </div>
    );
}