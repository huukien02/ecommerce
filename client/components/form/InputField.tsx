// components/form/InputField.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    useFormContext,
    Controller,
} from "react-hook-form";

interface InputFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function InputField({
    name,
    label,
    type = "text",
    placeholder,
    disabled,
}: InputFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="space-y-2">
                    <Label htmlFor={name}>{label}</Label>

                    <Input
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...field}
                    />

                    {fieldState.error && (
                        <p className="text-sm text-red-500">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}