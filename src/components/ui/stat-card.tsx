import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
  tone = "light",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  className?: string;
  tone?: "light" | "dark" | "accent";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        tone === "dark" && "border-white/10 bg-dark text-on-dark",
        tone === "accent" && "border-accent-soft bg-accent-soft text-ink",
        tone === "light" && "border-line bg-paper text-ink",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.18em]",
            tone === "dark" ? "text-on-dark/55" : "text-stone",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            tone === "dark"
              ? "bg-white/10 text-on-dark"
              : "bg-sand text-ink",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 font-display text-4xl leading-none tracking-[-0.04em] tabular-nums">
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs leading-5",
            tone === "dark" ? "text-on-dark/50" : "text-stone",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
