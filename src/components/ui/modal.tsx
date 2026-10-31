"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

/**
 * Small wrapper around the shadcn Dialog so every modal in the app shares the
 * same header, spacing, and sizes.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className={cn(sizes[size], className)}>
        <div className="border-b border-line/80 px-5 py-5 pr-14 sm:px-7 sm:py-6">
          <DialogTitle className={title ? undefined : "sr-only"}>
            {title ?? "Dialog"}
          </DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </div>
        <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
