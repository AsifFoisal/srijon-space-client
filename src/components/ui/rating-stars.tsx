import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const percentage = Math.max(0, Math.min(100, (rating / 5) * 100));
  const stars = [0, 1, 2, 3, 4];

  return (
    <span
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      className={cn("relative inline-flex shrink-0", className)}
    >
      <span className="flex gap-0.5 text-ink/15" aria-hidden="true">
        {stars.map((star) => (
          <Star
            key={star}
            width={size}
            height={size}
            className="shrink-0 fill-current"
            strokeWidth={0}
          />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-accent"
        style={{ width: `${percentage}%` }}
        aria-hidden="true"
      >
        {stars.map((star) => (
          <Star
            key={star}
            width={size}
            height={size}
            className="shrink-0 fill-current"
            strokeWidth={0}
          />
        ))}
      </span>
    </span>
  );
}
