"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  PlusCircle,
  Star,
  Trash2,
  PencilLine,
} from "lucide-react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useMarketplace } from "@/context/marketplace-context";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ListingStatusBadge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { StatCard } from "@/components/ui/stat-card";
import { SmartImage } from "@/components/ui/smart-image";
import { Skeleton, StatRowSkeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import { formatCurrency, getInitials } from "@/lib/utils";

function MyListingsContent() {
  const { user } = useAuth();
  const {
    isReady,
    getStudiosFor,
    getBookingsFor,
    removeStudio,
  } = useMarketplace();
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!user) return null;

  const listings = getStudiosFor(user.email);
  const bookings = getBookingsFor(user.email);
  const activeListings = listings.filter(
    (studio) => studio.status === "Active",
  ).length;
  const listingIds = new Set(listings.map((studio) => studio.id));
  const listingBookings = bookings.filter((booking) =>
    listingIds.has(booking.studioId),
  ).length;
  const rated = listings.filter((studio) => studio.rating > 0);
  const averageRating = rated.length
    ? (
        rated.reduce((total, studio) => total + studio.rating, 0) /
        rated.length
      ).toFixed(1)
    : "—";

  async function handleDelete() {
    if (!deleteTarget || !user) return;
    setDeleting(true);
    try {
      await removeStudio(deleteTarget.id, user);
      toast.success("Listing deleted. It's no longer visible on the marketplace.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't delete this listing. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function DeleteButton({ studio }: { studio: Studio }) {
    return (
      <button
        type="button"
        onClick={() => setDeleteTarget(studio)}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-accent/30 px-4 text-[13px] font-medium text-accent-deep transition-colors hover:bg-accent-soft"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </button>
    );
  }

  return (
    <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
      <DashboardPageHeader
        kicker="For hosts"
        title="My Studio Listings"
        description="Manage your creative spaces, update their information, and keep your listings organised."
        action={
          <Link href="/add-studio" className={buttonStyles()}>
            <PlusCircle className="size-4" aria-hidden="true" />
            Add New Studio
          </Link>
        }
      />

      <div className="mt-8">
        {!isReady ? (
          <StatRowSkeleton count={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total listings"
              value={listings.length}
              hint="Spaces you manage"
              icon={Building2}
            />
            <StatCard
              label="Active listings"
              value={activeListings}
              hint="Visible on the marketplace"
              icon={Building2}
            />
            <StatCard
              label="Total bookings"
              value={listingBookings}
              hint="Bookings across your spaces"
              icon={CalendarCheck}
            />
            <StatCard
              label="Average rating"
              value={averageRating}
              hint={`${rated.length} rated listing${rated.length === 1 ? "" : "s"}`}
              icon={Star}
            />
          </div>
        )}
      </div>

      <div className="mt-10">
        {!isReady ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-paper">
            <div className="space-y-4 p-5">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<Building2 className="size-6" aria-hidden="true" />}
            title="You Haven't Listed a Studio Yet."
            description="Your space could be the one a creator is searching for. Add your first listing and start welcoming bookings."
          >
            <Link href="/add-studio" className={buttonStyles()}>
              <PlusCircle className="size-4" aria-hidden="true" />
              Add Your First Studio
            </Link>
            <Link href="/dashboard" className={buttonStyles({ variant: "outline" })}>
              Back to Dashboard
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-line bg-paper md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-ivory/80 text-[10px] uppercase tracking-[0.16em] text-stone">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Listing</th>
                    <th className="px-4 py-3.5 font-medium">Location</th>
                    <th className="px-4 py-3.5 font-medium">Rate</th>
                    <th className="px-4 py-3.5 font-medium">Rating</th>
                    <th className="px-4 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {listings.map((studio) => (
                    <tr
                      key={studio.id}
                      className="transition-colors hover:bg-ivory/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                            <SmartImage
                              src={studio.mainImage}
                              alt={studio.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/studios/${studio.id}`}
                              className="font-medium text-ink transition-colors hover:text-accent-deep"
                            >
                              {studio.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-stone">
                              {studio.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-stone">
                        {studio.location}
                      </td>
                      <td className="px-4 py-4 text-ink">
                        {formatCurrency(studio.hourlyRate)}
                        <span className="text-xs text-stone"> /hr</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={studio.rating} size={11} />
                          <span className="text-xs text-stone">
                            {studio.rating > 0
                              ? studio.rating.toFixed(1)
                              : "New"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <ListingStatusBadge status={studio.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/studios/edit/${studio.id}`}
                            className={buttonStyles({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            <PencilLine
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            Update
                          </Link>
                          <DeleteButton studio={studio} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {listings.map((studio) => (
                <article
                  key={studio.id}
                  className="rounded-2xl border border-line bg-paper p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg">
                      <SmartImage
                        src={studio.mainImage}
                        alt={studio.title}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/studios/${studio.id}`}
                        className="font-display text-lg leading-tight text-ink"
                      >
                        {studio.title}
                      </Link>
                      <p className="mt-1 text-xs text-stone">
                        {studio.category} · {studio.location}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-ink">
                          {formatCurrency(studio.hourlyRate)}/hr
                        </span>
                        <ListingStatusBadge status={studio.status} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 border-t border-line/70 pt-4">
                    <Link
                      href={`/studios/edit/${studio.id}`}
                      className={buttonStyles({
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                      })}
                    >
                      <PencilLine className="size-3.5" aria-hidden="true" />
                      Update
                    </Link>
                    <div className="flex-1">
                      <DeleteButton studio={studio} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete This Studio?"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete Studio"
        loadingLabel="Deleting…"
        loading={deleting}
      >
        {deleteTarget ? (
          <div className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sand">
              <SmartImage
                src={deleteTarget.mainImage}
                alt={deleteTarget.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {deleteTarget.title}
              </p>
              <p className="mt-0.5 text-xs text-stone">
                {deleteTarget.category} · {deleteTarget.location}
              </p>
            </div>
            <span className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-medium text-stone">
              {getInitials(deleteTarget.title)}
            </span>
          </div>
        ) : null}
      </ConfirmModal>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyListingsContent />
    </RequireAuth>
  );
}
