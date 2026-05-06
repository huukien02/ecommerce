"use client";

import { FormProvider, useForm, SubmitHandler, UseFormProps, FieldValues } from "react-hook-form";
import { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

interface BaseFormProps<T extends FieldValues> {
    schema?: ZodType<any, any, any>;
    defaultValues?: UseFormProps<T>["defaultValues"];
    onSubmit: SubmitHandler<T>;
    children: ReactNode;
    className?: string;
}

export default function BaseForm<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    children,
    className,
}: BaseFormProps<T>) {
    const methods = useForm<T>({
        defaultValues,
        resolver: schema ? (zodResolver(schema) as any) : undefined,
    });

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={className}
            >
                {children}
            </form>
        </FormProvider>
    );
}