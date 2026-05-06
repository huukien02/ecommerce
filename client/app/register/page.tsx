"use client";

import { useRegister } from "@/features/auth/auth.hooks";
import { registerSchema, RegisterFormData } from "@/features/auth/auth.schema";
import BaseForm from "@/components/form/BaseForm";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
    const { mutate, isPending } = useRegister();

    const onSubmit = (data: RegisterFormData) => {
        mutate(data);
    };

    return (
        <div className="min-h-screen flex w-full bg-background">
            {/* Left side: Abstract Art */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-950 items-center justify-center">
                {/* Dynamic gradient blobs */}
                <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse duration-1000"></div>
                <div className="absolute w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl bottom-0 -right-20 mix-blend-screen"></div>
                <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen animate-pulse delay-700"></div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-lg text-center p-8 glassmorphism rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Start your journey
                    </h2>
                    <p className="text-zinc-300 text-lg">
                        Create an account to get personalized recommendations, track orders, and experience the best shopping.
                    </p>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 xl:px-48 relative z-10 bg-background/80 backdrop-blur-md">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="space-y-2 text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90 font-sans">
                            Create an account
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your details to get started.
                        </p>
                    </div>

                    <BaseForm<RegisterFormData>
                        schema={registerSchema}
                        defaultValues={{ name: "", email: "", password: "" }}
                        onSubmit={onSubmit}
                        className="space-y-5"
                    >
                        <InputField
                            name="name"
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            disabled={isPending}
                        />

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

                        <Button
                            type="submit"
                            className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-lg h-11 mt-4"
                            disabled={isPending}
                        >
                            {isPending ? "Creating account..." : "Sign up"}
                        </Button>
                    </BaseForm>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline transition-all"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
