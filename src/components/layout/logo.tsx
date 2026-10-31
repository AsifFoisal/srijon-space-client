import { Aperture } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  className,
  href = "/",
  onNavigate,
}: {
  light?: boolean;
  className?: string;
  href?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label="Srijon Space home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full border transition-transform duration-500 group-hover:rotate-45",
          light
            ? "border-white/20 bg-white/10"
            : "border-ink/10 bg-ink",
        )}
      >
        <Aperture
          className="size-[19px] text-accent"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          "text-[20px] font-normal leading-none",
          light ? "text-on-dark" : "text-ink",
        )}
        style={{ fontFamily: "var(--font-playwrite)" }}
      >
        Srijon{" "}<span className="text-accent">Space</span>
      </span>
    </Link>
  );
}
