"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { useMarketplace } from "@/context/marketplace-context";
import { CategoryBadge, RatingBadge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { cn, formatCurrency } from "@/lib/utils";

export function StudioCard({
  studio,
  priority = false,
}: {
  studio: Studio;
  priority?: boolean;
}) {
  const { isFavorite, toggleFavorite } = useMarketplace();
  const saved = isFavorite(studio.id);

  function handleSave() {
    toggleFavorite(studio.id);
    toast.success(
      saved ? "Removed from your saved studios." : "Saved for later.",
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-paper transition-all duration-500 hover:border-ink/25 hover:shadow-[0_24px_60px_-36px_rgba(23,21,18,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={`/studios/${studio.id}`}
          aria-label={`View ${studio.title}`}
          className="relative block h-full w-full"
        >
          <SmartImage
            src={studio.mainImage}
            alt={studio.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            className="object-cover"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          <CategoryBadge>{studio.category}</CategoryBadge>
          <RatingBadge rating={studio.rating} count={studio.reviewCount} />
        </div>

        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved studios" : "Save studio"}
          aria-pressed={saved}
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full border border-white/40 bg-paper/90 text-ink shadow-sm backdrop-blur transition-transform duration-300 hover:scale-105 hover:bg-paper"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              saved && "fill-accent text-accent",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-stone">
          <MapPin className="size-3" aria-hidden="true" />
          {studio.location}
        </p>

        <h3 className="mt-2 font-display text-xl leading-tight tracking-[-0.03em] text-ink">
          <Link
            href={`/studios/${studio.id}`}
            className="transition-colors hover:text-accent-deep"
          >
            {studio.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone">
          {studio.shortDescription}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-stone">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden="true" />
            Up to {studio.capacity}
          </span>
          <span className="h-3 w-px bg-line" aria-hidden="true" />
          <span>
            {studio.squareFeet > 0
              ? `${studio.squareFeet.toLocaleString("en-US")} sq ft`
              : "Flexible layout"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p>
            <span className="font-display text-2xl tracking-[-0.03em] text-ink">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="text-xs text-stone"> / hr</span>
          </p>
          <Link
            href={`/studios/${studio.id}`}
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
