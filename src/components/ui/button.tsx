"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * shadcn-style button built with cva. `buttonStyles` lets us reuse the exact
 * same look on Next.js links.
 */
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "relative isolate overflow-hidden bg-accent text-white shadow-[0_12px_30px_-14px_rgba(232,73,29,0.85)] before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:h-0 before:w-0 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-accent-deep before:transition-all before:duration-500 before:ease-out before:content-[''] hover:before:h-56 hover:before:w-56 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-gradient-to-b after:from-transparent after:via-transparent after:to-white/20 after:opacity-30 after:content-['']",
        secondary: "bg-ink text-ivory hover:bg-dark-soft",
        outline:
          "border border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-ink/[0.04]",
        ghost: "text-ink hover:bg-ink/[0.06]",
        danger: "bg-ink text-ivory hover:bg-accent-deep",
        light:
          "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
        dark:
          "bg-[#f7f3eb] text-[#171512] hover:bg-[#ece4d5]",
      },
      size: {
        sm: "h-10 px-4 text-[13px]",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-[15px]",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;

export function buttonStyles({
  variant,
  size,
  className,
}: VariantProps<typeof buttonVariants> & { className?: string } = {}) {
  return cn(buttonVariants({ variant, size }), className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
