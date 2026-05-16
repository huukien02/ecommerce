"use client";

import { useRegister } from "@/features/auth/auth.hooks";
import { registerSchema, RegisterFormData } from "@/features/auth/auth.schema";
import BaseForm from "@/components/form/BaseForm";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
    const { mutate, isPending } = useRegister();

    return (
        <div className="min-h-screen flex w-full bg-background">
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                <div className="w-full max-w-md mx-auto space-y-8 border border-muted rounded-lg p-8">
                    <div className="space-y-2 text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90 font-sans">
                            Tạo tài khoản
                        </h1>
                        <p className="text-muted-foreground">
                            Nhập thông tin để bắt đầu mua sắm.
                        </p>
                    </div>

                    <BaseForm<RegisterFormData>
                        schema={registerSchema}
                        defaultValues={{ name: "", email: "", password: "" }}
                        onSubmit={(data) => mutate(data)}
                        className="space-y-5"
                    >
                        <InputField
                            name="name"
                            label="Họ tên"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            disabled={isPending}
                        />

                        <InputField
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            disabled={isPending}
                        />

                        <InputField
                            name="password"
                            label="Mật khẩu"
                            type="password"
                            placeholder="••••••••"
                            disabled={isPending}
                        />

                        <Button
                            type="submit"
                            className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-lg h-11 mt-4"
                            disabled={isPending}
                        >
                            {isPending ? "Đang tạo tài khoản..." : "Đăng ký"}
                        </Button>
                    </BaseForm>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline transition-all"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
