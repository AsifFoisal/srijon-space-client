import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Check, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";

import type { Studio } from "@/lib/types";
import { BASE_STUDIOS } from "@/data/studios";
import { BASE_REVIEWS } from "@/data/reviews";
import { FALLBACK_AVATAR } from "@/lib/constants";
import { StudioGallery } from "@/components/studios/gallery";
import { BookingCard } from "@/components/studios/booking-card";
import { Avatar } from "@/components/ui/avatar";
import { RatingStars } from "@/components/ui/rating-stars";
import { DetailsSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDateLabel } from "@/lib/utils";

interface ApiStudio {
  _id: string;
  title?: string;
  category?: string;
  hourlyRate?: string | number;
  securityDeposit?: string | number;
  capacity?: string | number;
  address?: string;
  imageUrl?: string;
  description?: string;
  amenities?: string[];
  ownerEmail?: string;
  ownerName?: string;
}

function apiStudioToStudio(data: ApiStudio): Studio {
  const description = data.description || "";
  const address = data.address || "";
  const ownerName = data.ownerName || "Studio Host";

  return {
    id: data._id,
    title: data.title || "Untitled Studio",
    category: (data.category || "Photo Studio") as Studio["category"],
    hourlyRate: Number(data.hourlyRate) || 0,
    securityDeposit: Number(data.securityDeposit) || 0,
    capacity: Number(data.capacity) || 1,
    location: address,
    city: address,
    address: address,
    shortDescription:
      description.length > 140
        ? description.slice(0, 137) + "..."
        : description,
    description: description,
    mainImage: data.imageUrl || "",
    gallery: data.imageUrl ? [data.imageUrl] : [],
    amenities: (data.amenities || []) as Studio["amenities"],
    rating: 0,
    reviewCount: 0,
    host: {
      name: ownerName,
      email: data.ownerEmail || "",
      avatar: FALLBACK_AVATAR,
      memberSince: "2026",
      verified: false,
      bio: ownerName + " is a host on Srijon Space.",
    },
    ownerEmail: data.ownerEmail || "",
    status: "Active",
    featured: false,
    createdAt: new Date().toISOString(),
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    openTime: "08:00",
    closeTime: "22:00",
    specs: [
      { label: "Capacity", value: (data.capacity || 1) + " guests" },
      { label: "Category", value: data.category || "Studio" },
      { label: "Location", value: address || "—" },
    ],
    squareFeet: 0,
  };
}

async function getStudio(id: string): Promise<Studio | null> {
  if (/^[a-f0-9]{24}$/i.test(id)) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studio/${id}`,
        { cache: "no-store" },
      );

      if (response.ok) {
        const data = await response.json();

        if (data && data._id) {
          return apiStudioToStudio(data);
        }
      }
    } catch {
      // Fall through to the local studio data.
    }
  }

  return BASE_STUDIOS.find((studio) => studio.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: PageProps<"/studios/[id]">): Promise<Metadata> {
  const { id } = await params;
  const studio = BASE_STUDIOS.find((item) => item.id === id);

  return {
    title: studio ? studio.title : "Studio",
    description: studio ? studio.shortDescription : undefined,
  };
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

  const reviews = BASE_REVIEWS.filter((review) => review.studioId === id);
  const images = Array.from(
    new Set([studio.mainImage, ...studio.gallery].filter(Boolean)),
  );

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

              {studio.rating > 0 ? (
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
            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
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
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-start">
              <Avatar
                src={studio.host.avatar}
                name={studio.host.name}
                size={56}
              />
              <div className="min-w-0">
                <h3 className="font-display text-xl tracking-[-0.02em]">
                  {studio.host.name}
                </h3>
                <p className="mt-1 text-xs text-stone">
                  Hosting since {studio.host.memberSince}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone">
                  {studio.host.bio}
                </p>
                {studio.host.email ? (
                  <p className="mt-2 text-xs text-stone">{studio.host.email}</p>
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
