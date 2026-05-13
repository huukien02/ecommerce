"use client";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    useFormContext,
    Controller,
} from "react-hook-form";

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectFieldProps {
    name: string;
    label: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
}

export default function SelectField({
    name,
    label,
    options,
    placeholder = "Select an option",
    disabled,
}: SelectFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="space-y-2">
                    <Label htmlFor={name}>{label}</Label>

                    <Select
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                        id={name}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>

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
