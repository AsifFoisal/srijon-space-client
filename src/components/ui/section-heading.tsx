import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  action,
  align = "left",
  light = false,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "left" && action
          ? "md:flex-row md:items-end md:justify-between"
          : "",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {kicker ? (
          <p className={cn("kicker", light && "kicker-light")}>{kicker}</p>
        ) : null}
        <h2
          className={cn(
            "mt-3 text-balance font-display text-3xl leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-[44px]",
            light ? "text-ivory" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-pretty text-[15px] leading-7",
              light ? "text-ivory/65" : "text-stone",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
