"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  children: ReactNode;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  containerClassName,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-2 block text-[13px] font-medium text-ink"
        >
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs leading-5 text-accent-deep" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs leading-5 text-stone" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    error,
    hint,
    icon,
    endAdornment,
    className,
    containerClassName,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      containerClassName={containerClassName}
    >
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone">
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink placeholder:text-stone/70 transition-colors hover:border-ink/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60",
            icon && "pl-11",
            endAdornment && "pr-12",
            error &&
              "border-accent focus:border-accent focus:ring-accent/20",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {endAdornment ? (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {endAdornment}
          </span>
        ) : null}
      </div>
    </FieldShell>
  );
});

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { id, label, error, hint, className, containerClassName, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <FieldShell
        id={inputId}
        label={label}
        error={error}
        hint={hint}
        containerClassName={containerClassName}
      >
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-32 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink placeholder:text-stone/70 transition-colors hover:border-ink/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60",
            error &&
              "border-accent focus:border-accent focus:ring-accent/20",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
      </FieldShell>
    );
  },
);

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { id, label, error, hint, className, containerClassName, children, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <FieldShell
        id={inputId}
        label={label}
        error={error}
        hint={hint}
        containerClassName={containerClassName}
      >
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "h-12 w-full appearance-none rounded-xl border border-line bg-paper px-4 pr-10 text-sm text-ink transition-colors hover:border-ink/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60",
              error &&
                "border-accent focus:border-accent focus:ring-accent/20",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-stone"
            aria-hidden="true"
          />
        </div>
      </FieldShell>
    );
  },
);

export function CheckboxField({
  label,
  checked,
  onChange,
  name,
  disabled,
  description,
  id,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  description?: ReactNode;
  id?: string;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        "flex cursor-pointer items-start gap-2.5 text-sm text-ink",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        id={fieldId}
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-line accent-[#e8491d]"
      />
      <span>
        <span className="font-medium">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-5 text-stone">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
