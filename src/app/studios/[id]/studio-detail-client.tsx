"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  Building2,
  CalendarDays,
  Camera,
  Car,
  Heart,
  Lightbulb,
  MapPin,
  Mic,
  Monitor,
  Share2,
  Sun,
  Users,
  Utensils,
  Volume2,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Amenity } from "@/lib/types";
import { useMarketplace } from "@/context/marketplace-context";
import { StudioGallery } from "@/components/studios/gallery";
import { BookingCard } from "@/components/studios/booking-card";
import { ContactHostModal } from "@/components/studios/contact-host-modal";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { RatingStars } from "@/components/ui/rating-stars";
import { DetailsSkeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import {
  cn,
  formatDateLabel,
  formatTimeLabel,
  weekdayName,
} from "@/lib/utils";

const amenityIcons: Record<Amenity, LucideIcon> = {
  "Wi-Fi": Wifi,
  "Air Conditioning": Wind,
  "Lighting Equipment": Lightbulb,
  "Professional Cameras": Camera,
  Soundproofing: Volume2,
  Microphones: Mic,
  "Editing Equipment": Monitor,
  Parking: Car,
  Kitchen: Utensils,
  Restroom: Bath,
  "Natural Lighting": Sun,
};

function buildBreakdown(rating: number) {
  const five = Math.round(
    Math.min(0.92, Math.max(0.55, (rating - 3.4) / 1.6)) * 100,
  );
  const four = Math.round((100 - five) * 0.6);
  const three = Math.round((100 - five) * 0.26);
  const two = Math.round((100 - five) * 0.1);
  const one = Math.max(0, 100 - five - four - three - two);

  return [
    { stars: 5, percent: five },
    { stars: 4, percent: four },
    { stars: 3, percent: three },
    { stars: 2, percent: two },
    { stars: 1, percent: one },
  ];
}

export function StudioDetailClient({ id }: { id: string }) {
  const {
    getStudio,
    getReviews,
    isFavorite,
    toggleFavorite,
    isReady,
  } = useMarketplace();
  const [contactOpen, setContactOpen] = useState(false);
  const studio = getStudio(id);

  if (!isReady) {
    return (
      <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="shell shell-wide pb-20 pt-32">
        <EmptyState
          icon={<Building2 className="size-6" aria-hidden="true" />}
          title="This space could not be found."
          description="The listing may have been removed, or the link is incorrect. Explore the marketplace to find another studio that fits your project."
        >
          <Link href="/studios" className={buttonStyles()}>
            Explore Studios
          </Link>
          <Link
            href="/"
            className={buttonStyles({ variant: "outline" })}
          >
            Back Home
          </Link>
        </EmptyState>
      </div>
    );
  }

  const saved = isFavorite(studio.id);
  const reviews = getReviews(studio.id);
  const images = Array.from(
    new Set([studio.mainImage, ...studio.gallery]),
  ).filter(Boolean);
  const availabilityDays = studio.availableDays
    .map((day) => weekdayName(day).slice(0, 3))
    .join(" · ");
  const availabilityHours = `${formatTimeLabel(studio.openTime)} – ${formatTimeLabel(studio.closeTime)}`;
  const breakdown = buildBreakdown(studio.rating);
  const studioId = studio.id;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to your clipboard.");
    } catch {
      toast.error("Could not copy the link. Please copy the URL manually.");
    }
  }

  function handleSave() {
    toggleFavorite(studioId);
    toast.success(
      saved ? "Removed from your saved studios." : "Saved for later.",
    );
  }

  return (
    <div>
      <div className="shell shell-wide pb-7 pt-28 sm:pt-32">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All studios
        </Link>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">
                {studio.category}
              </span>
              {studio.featured ? (
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                  Featured space
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.01] tracking-[-0.05em]">
              {studio.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {studio.location}
              </span>
              <span className="flex items-center gap-2">
                <RatingStars rating={studio.rating} size={13} />
                {studio.rating > 0 ? (
                  <span>
                    {studio.rating.toFixed(1)} ({studio.reviewCount} reviews)
                  </span>
                ) : (
                  <span>New listing</span>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" aria-hidden="true" />
                Up to {studio.capacity} guests
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-medium text-ink transition-colors hover:border-ink/30"
            >
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </button>
            <button
              type="button"
              onClick={handleSave}
              aria-pressed={saved}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                saved
                  ? "border-accent/30 bg-accent-soft text-accent-deep"
                  : "border-line bg-paper text-ink hover:border-ink/30",
              )}
            >
              <Heart
                className={cn("size-4", saved && "fill-accent text-accent")}
                aria-hidden="true"
              />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="shell shell-wide pb-10">
        <StudioGallery images={images} title={studio.title} />
      </div>

      <div className="shell shell-wide pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="order-2 min-w-0 lg:order-1">
            <section>
              <h2 className="font-display text-2xl tracking-[-0.03em]">
                About this space
              </h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-stone">
                {studio.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                {studio.specs.map((spec) => (
                  <div key={spec.label} className="bg-paper p-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
                      {spec.label}
                    </p>
                    <p className="mt-1.5 font-display text-lg tracking-[-0.02em]">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 text-sm text-stone sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {studio.address}
                </span>
                <span className="flex items-start gap-2">
                  <CalendarDays
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {availabilityDays} · {availabilityHours}
                </span>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-2xl tracking-[-0.03em]">
                Amenities &amp; equipment
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-line/70 bg-paper px-4 py-3 text-sm text-ink"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      {amenity}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-2xl tracking-[-0.03em]">
                Your host
              </h2>
              <div className="mt-5 rounded-2xl border border-line bg-paper p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <Avatar
                    src={studio.host.avatar}
                    name={studio.host.name}
                    size={64}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl tracking-[-0.02em]">
                        {studio.host.name}
                      </h3>
                      {studio.host.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-deep">
                          <BadgeCheck
                            className="size-3"
                            aria-hidden="true"
                          />
                          Verified host
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-stone">
                      Hosting since {studio.host.memberSince}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone">
                      {studio.host.bio}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className={buttonStyles({
                      variant: "outline",
                      className: "w-full sm:w-auto",
                    })}
                  >
                    Contact Host
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl tracking-[-0.03em]">
                  Reviews
                </h2>
                <p className="text-sm text-stone">
                  {studio.reviewCount} review
                  {studio.reviewCount === 1 ? "" : "s"} overall
                </p>
              </div>

              {reviews.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-line bg-paper/70 px-6 py-10 text-center">
                  <p className="font-display text-xl">No reviews yet.</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone">
                    This is a newer listing. Be the first to book it and share
                    what the space was like.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-8 rounded-2xl border border-line bg-paper p-6 sm:p-7 lg:grid-cols-[220px_1fr]">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-display text-5xl tracking-[-0.05em]">
                        {studio.rating.toFixed(1)}
                      </p>
                      <div>
                        <RatingStars rating={studio.rating} size={14} />
                        <p className="mt-1 text-xs text-stone">
                          {studio.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      {breakdown.map((row) => (
                        <div
                          key={row.stars}
                          className="flex items-center gap-2 text-[11px] text-stone"
                        >
                          <span className="w-3">{row.stars}</span>
                          <span className="text-accent" aria-hidden="true">
                            ★
                          </span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                            <span
                              className="block h-full rounded-full bg-accent"
                              style={{ width: `${row.percent}%` }}
                            />
                          </span>
                          <span className="w-8 text-right">{row.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5 border-t border-line/70 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    {reviews.map((review) => (
                      <article
                        key={review.id}
                        className="border-b border-line/60 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar
                            src={review.avatar}
                            name={review.name}
                            size={40}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium text-ink">
                                {review.name}
                              </p>
                              <p className="text-[11px] text-stone">
                                {formatDateLabel(review.date, "MMM d, yyyy")}
                              </p>
                            </div>
                            <RatingStars
                              rating={review.rating}
                              size={12}
                              className="mt-1"
                            />
                            <p className="mt-2 text-sm leading-6 text-stone">
                              {review.text}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                    <p className="text-[11px] text-stone">
                      Showing {reviews.length} recent review
                      {reviews.length === 1 ? "" : "s"} from the StudioSpace
                      community.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <BookingCard key={studio.id} studio={studio} />
            </div>
          </aside>
        </div>
      </div>

      <ContactHostModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        studio={studio}
      />
    </div>
  );
}
