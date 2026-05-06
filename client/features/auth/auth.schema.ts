import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Vui lòng nhập email hợp lệ."),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự."),
    email: z.string().email("Vui lòng nhập email hợp lệ."),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
