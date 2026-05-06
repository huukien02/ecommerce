"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    useFormContext,
    Controller,
} from "react-hook-form";

interface TextareaFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
}

export default function TextareaField({
    name,
    label,
    placeholder,
    disabled,
    rows = 4,
}: TextareaFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="space-y-2">
                    <Label htmlFor={name}>{label}</Label>

                    <Textarea
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows}
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
