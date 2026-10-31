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
          "bg-accent text-white shadow-[0_12px_30px_-14px_rgba(232,73,29,0.85)] hover:bg-accent-deep",
        secondary: "bg-ink text-ivory hover:bg-dark-soft",
        outline:
          "border border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-ink/[0.04]",
        ghost: "text-ink hover:bg-ink/[0.06]",
        danger: "bg-ink text-ivory hover:bg-accent-deep",
        light:
          "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
        dark: "bg-ivory text-ink hover:bg-sand",
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
