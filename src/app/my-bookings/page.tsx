"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { SmartImage } from "@/components/ui/smart-image";
import {
  BookingCardSkeleton,
  StatRowSkeleton,
} from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  formatDateLabel,
  formatDuration,
  formatTimeLabel,
} from "@/lib/utils";

type Tab = "All" | BookingStatus;
const TABS: Tab[] = ["All", ...BOOKING_STATUSES];

function MyBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("All");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${user?.email}`,
        );
        const bookings: Booking[] = await res.json();
        setBookings(Array.isArray(bookings) ? bookings : []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (!user) return null;

  const sorted = [...bookings].sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || ""),
  );
  const visible =
    tab === "All"
      ? sorted
      : sorted.filter((booking) => booking.status === tab);

  const countFor = (status: Tab) =>
    status === "All"
      ? sorted.length
      : sorted.filter((booking) => booking.status === status).length;

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${cancelTarget._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Cancelled" }),
        },
      );
      if (!res.ok) throw new Error("Failed to cancel the booking.");

      setBookings((current) =>
        current.map((booking) =>
          booking._id === cancelTarget._id
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );
      toast.success("Booking cancelled. The space is available to book again.");
      setCancelTarget(null);
    } catch {
      toast.error("We couldn't cancel this booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
      <DashboardPageHeader
        kicker="Your sessions"
        title="My Bookings"
        description="Track your reservations and manage your upcoming creative sessions."
        action={
          <Link href="/studios" className={buttonStyles()}>
            Explore Studios
          </Link>
        }
      />

      <div className="mt-8">
        {loading ? (
          <StatRowSkeleton count={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total bookings"
              value={countFor("All")}
              hint="Every request you've made"
              icon={CalendarCheck}
            />
            <StatCard
              label="Pending"
              value={countFor("Pending")}
              hint="Waiting for host confirmation"
              icon={Clock3}
            />
            <StatCard
              label="Confirmed"
              value={countFor("Confirmed")}
              hint="Sessions locked in"
              icon={CalendarClock}
            />
            <StatCard
              label="Completed"
              value={countFor("Completed")}
              hint="Past sessions"
              icon={CheckCircle2}
            />
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList className="mt-9 flex w-full gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((item) => (
            <TabsTrigger key={item} value={item} className="shrink-0">
              {item}
              <span className="flex min-w-5 items-center justify-center rounded-full bg-sand px-1.5 py-0.5 text-[10px] text-stone group-data-[state=active]:bg-white/15 group-data-[state=active]:text-ivory">
                {countFor(item)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<CalendarX2 className="size-6" aria-hidden="true" />}
            title="Your Creative Journey Starts Here."
            description="You haven't reserved a studio yet. Discover inspiring spaces and start creating."
          >
            <Link href="/studios" className={buttonStyles()}>
              Explore Studios
            </Link>
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="size-6" aria-hidden="true" />}
            title={`No ${tab.toLowerCase()} bookings.`}
            description="Nothing in this status right now. Switch tabs or book another space to fill your calendar."
          >
            <button
              type="button"
              onClick={() => setTab("All")}
              className={buttonStyles({ variant: "outline" })}
            >
              View All Bookings
            </button>
            <Link href="/studios" className={buttonStyles()}>
              Explore Studios
            </Link>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {visible.map((booking) => (
              <article
                key={booking._id}
                className="rounded-2xl border border-line bg-paper p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-40"
                  >
                    <SmartImage
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
                          {booking.category}
                          <span aria-hidden="true">·</span>
                          <MapPin className="size-3" aria-hidden="true" />
                          {booking.address}
                        </p>
                        <h3 className="mt-1.5 font-display text-xl leading-tight tracking-[-0.02em]">
                          <Link
                            href={`/studios/${booking.studioId}`}
                            className="transition-colors hover:text-accent-deep"
                          >
                            {booking.studioTitle}
                          </Link>
                        </h3>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                          Date
                        </p>
                        <p className="mt-0.5 font-medium text-ink">
                          {formatDateLabel(booking.date, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                          Time
                        </p>
                        <p className="mt-0.5 font-medium text-ink">
                          {formatTimeLabel(booking.startTime)} –{" "}
                          {formatTimeLabel(booking.endTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                          Duration
                        </p>
                        <p className="mt-0.5 font-medium text-ink">
                          {formatDuration(booking.durationHours)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                          Total
                        </p>
                        <p className="mt-0.5 font-medium text-ink">
                          {formatCurrency(booking.total)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-3">
                      <p className="text-[11px] text-stone">
                        {booking._id} · {formatCurrency(booking.hourlyRate)}/hr
                        · Deposit {formatCurrency(booking.securityDeposit)}
                      </p>
                      <div className="flex items-center gap-2">
                        {booking.status === "Pending" ? (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(booking)}
                            className="text-xs font-medium text-accent-deep transition-colors hover:underline"
                          >
                            Cancel Booking
                          </button>
                        ) : null}
                        <Link
                          href={`/studios/${booking.studioId}`}
                          className={buttonStyles({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          View Studio
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel This Booking?"
        description="Cancelling releases your reservation request. You can always book the space again later."
        confirmLabel="Confirm Cancellation"
        loadingLabel="Cancelling…"
        loading={cancelling}
      >
        {cancelTarget ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                <SmartImage
                  src={cancelTarget.studioImage}
                  alt={cancelTarget.studioTitle}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {cancelTarget.studioTitle}
                </p>
                <p className="mt-0.5 text-xs text-stone">
                  {formatDateLabel(cancelTarget.date, "EEE, MMM d")} ·{" "}
                  {formatTimeLabel(cancelTarget.startTime)} –{" "}
                  {formatTimeLabel(cancelTarget.endTime)}
                </p>
              </div>
            </div>
            <p className="mt-3 border-t border-line/70 pt-3 text-xs leading-5 text-stone">
              Your refundable deposit of{" "}
              <span className="font-medium text-ink">
                {formatCurrency(cancelTarget.securityDeposit)}
              </span>{" "}
              is released when the cancellation is confirmed.
            </p>
          </div>
        ) : null}
      </ConfirmModal>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <MyBookingsContent />
    </RequireAuth>
  );
}
