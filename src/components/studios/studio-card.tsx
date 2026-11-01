import Link from "next/link";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import type { Studio } from "@/lib/types";
import { CategoryBadge, RatingBadge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { formatCurrency } from "@/lib/utils";

export function StudioCard({
  studio,
  priority = false,
}: {
  studio: Studio;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-paper transition-all duration-500 hover:border-ink/25 hover:shadow-[0_24px_60px_-36px_rgba(23,21,18,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={`/studios/${studio._id}`}
          aria-label={`View ${studio.title}`}
          className="relative block h-full w-full"
        >
          <SmartImage
            src={studio.imageUrl}
            alt={studio.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            className="object-cover"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          <CategoryBadge>{studio.category}</CategoryBadge>
          <RatingBadge rating={studio.rating ?? 0} count={studio.reviewCount} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-stone">
          <MapPin className="size-3" aria-hidden="true" />
          {studio.address}
        </p>

        <h3 className="mt-2 font-display text-xl leading-tight tracking-[-0.03em] text-ink">
          <Link
            href={`/studios/${studio._id}`}
            className="transition-colors hover:text-accent-deep"
          >
            {studio.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone">
          {studio.description}
        </p>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-stone">
          <Users className="size-3.5" aria-hidden="true" />
          Up to {studio.capacity}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p>
            <span className="font-display text-2xl tracking-[-0.03em] text-ink tabular-nums">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="text-xs text-stone"> / hr</span>
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink transition-colors hover:text-accent"
          >
            View details
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
