import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper/70 px-6 py-16 text-center sm:py-20",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-sand text-accent">
        {icon}
      </div>
      <h3 className="mt-5 max-w-md font-display text-2xl text-ink text-balance">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-stone">
        {description}
      </p>
      {children ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
