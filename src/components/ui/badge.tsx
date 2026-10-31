import { Star } from "lucide-react";
import type { BookingStatus, ListingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/40 bg-paper/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RatingBadge({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  if (rating <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-dark/80 px-2.5 py-1 text-[11px] font-semibold text-on-dark backdrop-blur-sm",
          className,
        )}
      >
        New
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-dark/80 px-2.5 py-1 text-[11px] font-semibold text-on-dark backdrop-blur-sm",
        className,
      )}
    >
      <Star className="size-3 fill-accent text-accent" aria-hidden="true" />
      {rating.toFixed(1)}
      {typeof count === "number" ? (
        <span className="font-normal text-on-dark/70">({count})</span>
      ) : null}
    </span>
  );
}

const statusStyles: Record<BookingStatus, string> = {
  Pending: "border-accent/30 bg-accent-soft text-accent-deep",
  Confirmed: "border-ink/15 bg-ink text-ivory",
  Completed: "border-line bg-sand text-ink",
  Cancelled: "border-line bg-paper text-stone",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        statusStyles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

export function ListingStatusBadge({
  status,
  className,
}: {
  status: ListingStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        status === "Active"
          ? "border-ink/15 bg-ink text-ivory"
          : "border-accent/30 bg-accent-soft text-accent-deep",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
