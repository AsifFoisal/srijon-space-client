import Link from "next/link";
import { Aperture, MapPin } from "lucide-react";
import type { Studio } from "@/lib/types";
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
    <Link
      href={`/studios/${studio._id}`}
      aria-label={`View ${studio.title}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-paper transition-all duration-500 hover:border-ink/25 hover:shadow-[0_24px_60px_-36px_rgba(23,21,18,0.45)]"
    >
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <SmartImage
            src={studio.imageUrl}
            alt={studio.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
            aria-hidden="true"
          />

          <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-dark/80 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-on-dark backdrop-blur-sm">
            {studio.category}
          </span>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-paper px-4 py-1.5 shadow-[0_1px_8px_rgba(23,21,18,0.28)]">
          <span className="font-display text-lg tracking-[-0.02em] text-ink tabular-nums">
            {formatCurrency(studio.hourlyRate)}
          </span>
          <span className="ml-1 text-xs text-stone">/ hr</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="mt-7 flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-ivory">
            <Aperture className="size-5" aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <h3 className="truncate font-display text-xl leading-tight tracking-[-0.03em] text-ink">
              {studio.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-stone">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{studio.address}</span>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="grid grid-cols-2 divide-x divide-line rounded-xl bg-ink/[0.04] px-4 py-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
                Rating
              </p>
              <p className="mt-1 font-display text-lg leading-none tracking-[-0.02em] text-ink tabular-nums">
                {studio.rating ? studio.rating.toFixed(1) : "—"}
              </p>
            </div>

            <div className="pl-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
                Reviews
              </p>
              <p className="mt-1 font-display text-lg leading-none tracking-[-0.02em] text-ink tabular-nums">
                {studio.reviewCount ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
