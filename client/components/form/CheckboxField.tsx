"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    useFormContext,
    Controller,
} from "react-hook-form";

interface CheckboxFieldProps {
    name: string;
    label: string;
    disabled?: boolean;
}

export default function CheckboxField({
    name,
    label,
    disabled,
}: CheckboxFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={name}
                            disabled={disabled}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <Label
                            htmlFor={name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {label}
                        </Label>
                    </div>

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
