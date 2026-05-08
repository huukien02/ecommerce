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
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                <div className="w-full max-w-md mx-auto space-y-8 border border-muted rounded-lg p-8">
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
                            inputClassName="h-11"

                        />

                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            disabled={isPending}
                            inputClassName="h-11"
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
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline transition-all"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
