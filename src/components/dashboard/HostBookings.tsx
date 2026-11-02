"use client";

import { useState } from "react";
import Link from "next/link";
import { BookX } from "lucide-react";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES } from "@/lib/constants";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { Select } from "@/components/ui/input";
import {
  formatDateLabel,
  formatDuration,
  formatTimeLabel,
} from "@/lib/utils";

export function HostBookings({
  bookings: initialBookings,
}: {
  bookings: Booking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(
    booking: Booking,
    status: BookingStatus,
  ) {
    if (booking.status === status) return;
    setUpdatingId(booking._id);

    try {
      const token = await getTokenFromClient();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${booking._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        toast.error("The booking status couldn't be updated. Try again.");
        return;
      }

      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id ? { ...item, status } : item,
        ),
      );
      toast.success(`Booking marked as ${status.toLowerCase()}.`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="font-display text-lg tracking-[-0.02em]">
        Bookings for your studios
      </h2>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<BookX className="mt-1 size-6 text-stone" aria-hidden="true" />}
          title="No booking requests yet."
          description="When creators book one of your studios, the request shows up here so you can manage its status."
        />
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:p-5"
            >
              <Link
                href={`/studios/${booking.studioId}`}
                className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28"
              >
                <SmartImage
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg tracking-[-0.02em]">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="transition-colors hover:text-accent-deep"
                    >
                      {booking.studioTitle}
                    </Link>
                  </h3>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="mt-1 text-xs text-stone">
                  {booking.userName} · {booking.userEmail}
                </p>
                <p className="mt-1 text-xs text-stone">
                  {formatDateLabel(booking.date, "EEE, MMM d, yyyy")} ·{" "}
                  {formatTimeLabel(booking.startTime)} –{" "}
                  {formatTimeLabel(booking.endTime)} ·{" "}
                  {formatDuration(booking.durationHours)}
                </p>
              </div>

              <div className="w-full sm:w-44">
                <Select
                  aria-label={`Status for ${booking.studioTitle} booking`}
                  value={booking.status}
                  disabled={updatingId === booking._id}
                  onChange={(event) =>
                    handleStatusChange(booking, event.target.value as BookingStatus)
                  }
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
