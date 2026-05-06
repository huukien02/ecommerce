"use client";

import * as React from "react";
import {
    useFormContext,
    Controller,
    FormProvider,
} from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormField = Controller;

const FormItem = ({ className, ...props }: any) => (
    <div className={cn("space-y-2", className)} {...props} />
);

const FormLabel = ({ className, ...props }: any) => (
    <label className={cn("text-sm font-medium", className)} {...props} />
);

const FormControl = ({ ...props }: any) => {
    const { field } = useFormContext();
    return <div {...field} {...props} />;
};

const FormMessage = ({ name }: any) => {
    const {
        formState: { errors },
    } = useFormContext();

    const error = (errors as any)?.[name]?.message;

    if (!error) return null;

    return <p className="text-sm text-red-500">{error}</p>;
};

export {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
};