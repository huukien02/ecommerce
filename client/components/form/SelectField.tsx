"use client";

import { Label } from "@/components/ui/label";
import { useFormContext, Controller } from "react-hook-form";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

// Radix Select treats value="" as "nothing selected" → use sentinel for empty-string options
const EMPTY = "__empty__";
const toRadix = (v: string) => (v === "" ? EMPTY : v);
const fromRadix = (v: string) => (v === EMPTY ? "" : v);

// ── Standalone (no form context) ──────────────────────────────────────────────

interface SelectInputProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SelectInput({
  label,
  options,
  placeholder,
  disabled,
  value,
  onChange,
  className,
}: SelectInputProps) {
  return (
    <div className={label ? "space-y-2" : undefined}>
      {label && <Label>{label}</Label>}
      <SelectRoot
        value={toRadix(value)}
        onValueChange={(v) => onChange(fromRadix(v))}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={toRadix(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  );
}

// ── Form-connected ────────────────────────────────────────────────────────────

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
  placeholder = "Chọn một mục",
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
          <SelectRoot
            value={toRadix(field.value ?? "")}
            onValueChange={(v) => field.onChange(fromRadix(v))}
            disabled={disabled}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={toRadix(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
