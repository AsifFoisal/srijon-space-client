import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line/70 bg-paper">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <StudioCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function StatRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper p-5">
      <div className="flex gap-4">
        <Skeleton className="size-24 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-line/70 p-4 last:border-b-0"
        >
          <Skeleton className="size-14 rounded-lg" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="ml-auto h-4 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}
