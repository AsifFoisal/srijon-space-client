import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Check, MapPin, Users } from "lucide-react";

import type { Studio } from "@/lib/types";
import { BASE_REVIEWS } from "@/data/reviews";
import { FALLBACK_AVATAR } from "@/lib/constants";
import { StudioGallery } from "@/components/studios/gallery";
import { BookingCard } from "@/components/studios/booking-card";
import { Avatar } from "@/components/ui/avatar";
import { RatingStars } from "@/components/ui/rating-stars";
import { DetailsSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateLabel, getMockRating } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

async function getStudio(id: string): Promise<Studio | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;

  const token = await getTokenFromServer();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/studios/${id}`,{
      cache: "no-store",
      headers:{
        authorization: `Bearer ${token}`,
      }
    },
  ).catch(() => null);
  if (!response || !response.ok) return null;

  const data = await response.json();
  if (!data?._id) return null;

  const mock = getMockRating(id);
  return {
    ...data,
    hourlyRate: Number(data.hourlyRate) || 0,
    securityDeposit: Number(data.securityDeposit) || 0,
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    rating: data.rating ?? mock.rating,
    reviewCount: data.reviewCount ?? mock.reviewCount,
  } as Studio;
}

// The mock reviews are keyed by slug ids that never match Mongo ObjectIds, so
// every studio gets a small deterministic slice of them instead.
function getStudioReviews(id: string) {
  const seed = Number.parseInt(id.slice(-6), 16) || 0;
  const start = seed % BASE_REVIEWS.length;
  const count = 3 + (seed % 4);

  return Array.from(
    { length: count },
    (_, index) => BASE_REVIEWS[(start + index) % BASE_REVIEWS.length],
  );
}

export const instant = false;

async function StudioDetails({ id }: { id: string }) {
  const studio = await getStudio(id);

  if (!studio) {
    return (
      <div className="shell shell-wide pb-20 pt-32">
        <EmptyState
          icon={<Building2 className="size-6" aria-hidden="true" />}
          title="This space could not be found."
          description="The listing may have been removed, or the link is incorrect. Explore the marketplace to find another studio that fits your project."
        >
          <Link href="/studios" className="font-medium text-ink hover:underline">
            Explore Studios
          </Link>
        </EmptyState>
      </div>
    );
  }

  const reviews = getStudioReviews(id);
  const images =
    studio.images && studio.images.length
      ? studio.images
      : [studio.imageUrl || "/images/studios/daylight-loft.jpg"];
  const specs = [
    { label: "Capacity", value: `${studio.capacity} guests` },
    { label: "Category", value: studio.category },
    { label: "Location", value: studio.address || "—" },
  ];

  return (
    <main className="pb-20">
      <div className="shell shell-wide pt-28 sm:pt-32">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All studios
        </Link>
      </div>

      <div className="shell shell-wide py-8">
        <StudioGallery images={images} title={studio.title} />
      </div>

      <div className="shell shell-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div>
            <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">
              {studio.category}
            </span>

            <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.01] tracking-[-0.05em]">
              {studio.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {studio.address}
              </span>

              <span className="flex items-center gap-1.5">
                <Users className="size-4" aria-hidden="true" />
                Up to {studio.capacity} guests
              </span>

              {studio.rating && studio.rating > 0 ? (
                <span className="flex items-center gap-2">
                  <RatingStars rating={studio.rating} size={13} />
                  {studio.rating.toFixed(1)} ({studio.reviewCount} reviews)
                </span>
              ) : (
                <span>New listing</span>
              )}
            </div>

            <h2 className="mt-10 font-display text-2xl tracking-[-0.03em]">
              About this space
            </h2>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-stone">
              {studio.description}
            </p>

            <h2 className="mt-10 font-display text-2xl tracking-[-0.03em]">
              Specifications
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {specs.map((spec) => (
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

            <h2 className="mt-10 font-display text-2xl tracking-[-0.03em]">
              Amenities &amp; equipment
            </h2>
            {studio.amenities.length === 0 ? (
              <p className="mt-4 text-sm text-stone">
                No amenities listed for this studio.
              </p>
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-3 rounded-xl border border-line/70 bg-paper px-4 py-3 text-sm text-ink"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-10 font-display text-2xl tracking-[-0.03em]">
              Your host
            </h2>
            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-paper p-6">
              <Avatar
                src={FALLBACK_AVATAR}
                name={studio.ownerName}
                size={56}
              />
              <div className="min-w-0">
                <h3 className="font-display text-xl tracking-[-0.02em]">
                  {studio.ownerName || "Studio Host"}
                </h3>
                {studio.ownerEmail ? (
                  <p className="mt-1 text-xs text-stone">
                    {studio.ownerEmail}
                  </p>
                ) : null}
              </div>
            </div>

            <h2 className="mt-10 font-display text-2xl tracking-[-0.03em]">
              Reviews
            </h2>
            {reviews.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-line bg-paper/70 px-6 py-10 text-center">
                <p className="font-display text-xl">No reviews yet.</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone">
                  This is a newer listing. Be the first to book it and share
                  what the space was like.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-5 rounded-2xl border border-line bg-paper p-6 sm:p-7">
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
              </div>
            )}
          </div>

          <aside className="self-start lg:sticky lg:top-24">
            <BookingCard studio={studio} />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default async function StudioDetailsPage({
  params,
}: PageProps<"/studios/[id]">) {
  const { id } = await params;

  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <StudioDetails id={id} />
    </Suspense>
  );
}
