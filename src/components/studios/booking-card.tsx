"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { BookingModal } from "@/components/studios/booking-modal";
import { TIME_OPTIONS } from "@/lib/constants";
import {
  durationInHours,
  formatCurrency,
  formatDuration,
  formatTimeLabel,
  minutesToTime,
  parseDate,
  timeToMinutes,
  todayISO,
  weekdayName,
} from "@/lib/utils";

function getInitialDate(studio: Studio) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);

  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = new Date(base);
    candidate.setDate(base.getDate() + offset);
    if (studio.availableDays.includes(candidate.getDay())) {
      const timezoneOffset = candidate.getTimezoneOffset() * 60_000;
      return new Date(candidate.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
    }
  }

  return todayISO();
}

function getInitialTimes(studio: Studio) {
  const open = timeToMinutes(studio.openTime);
  const close = timeToMinutes(studio.closeTime);
  let start = Math.max(open, Math.min(10 * 60, close - 120));
  if (start + 120 > close) start = open;
  const end = Math.min(start + 120, close);
  return { startTime: minutesToTime(start), endTime: minutesToTime(end) };
}

export function BookingCard({ studio }: { studio: Studio }) {
  const router = useRouter();
  const { user } = useAuth();
  const initialTimes = getInitialTimes(studio);
  const [date, setDate] = useState(() => getInitialDate(studio));
  const [startTime, setStartTime] = useState(initialTimes.startTime);
  const [endTime, setEndTime] = useState(initialTimes.endTime);
  const [modalOpen, setModalOpen] = useState(false);

  const duration = durationInHours(startTime, endTime);
  const subtotal = Math.round(studio.hourlyRate * duration * 100) / 100;
  const total = Math.round((subtotal + studio.securityDeposit) * 100) / 100;
  const selectedDay = date ? parseDate(date).getDay() : new Date().getDay();
  const dayAvailable = studio.availableDays.includes(selectedDay);
  const timeOptions = TIME_OPTIONS.filter(
    (time) =>
      timeToMinutes(time) >= timeToMinutes(studio.openTime) &&
      timeToMinutes(time) <= timeToMinutes(studio.closeTime),
  );
  const invalidTime = duration <= 0;
  const disabled = !dayAvailable || invalidTime;

  function handleBook() {
    if (!user) {
      toast.info("Sign in to book this studio.");
      router.push(
        `/login?next=${encodeURIComponent(`/studios/${studio.id}`)}`,
      );
      return;
    }

    if (disabled) {
      toast.error(
        !dayAvailable
          ? "This studio is closed on the selected day. Please pick another date."
          : "Please choose an end time after your start time.",
      );
      return;
    }

    setModalOpen(true);
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(23,21,18,0.4)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p>
          <span className="font-display text-3xl tracking-[-0.04em]">
            {formatCurrency(studio.hourlyRate)}
          </span>
          <span className="text-sm text-stone"> / hour</span>
        </p>
        <div className="text-right">
          <RatingStars rating={studio.rating} size={12} />
          <p className="mt-1 text-[11px] text-stone">
            {studio.rating > 0
              ? `${studio.rating.toFixed(1)} · ${studio.reviewCount} reviews`
              : "New listing"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <label className="col-span-2 block">
          <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
            Date
          </span>
          <span className="relative block">
            <CalendarDays
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone"
              aria-hidden="true"
            />
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(event) => setDate(event.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-paper pl-10 pr-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
            Start
          </span>
          <span className="relative block">
            <Clock
              className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-stone"
              aria-hidden="true"
            />
            <select
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-line bg-paper pl-9 pr-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {formatTimeLabel(time)}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-stone">
            End
          </span>
          <span className="relative block">
            <Clock
              className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-stone"
              aria-hidden="true"
            />
            <select
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-line bg-paper pl-9 pr-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {formatTimeLabel(time)}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      {!dayAvailable ? (
        <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-xs leading-5 text-accent-deep">
          This studio is usually closed on {weekdayName(selectedDay)}. Pick
          another date to continue.
        </p>
      ) : null}

      {invalidTime ? (
        <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-xs leading-5 text-accent-deep">
          Your end time needs to be after your start time.
        </p>
      ) : null}

      <div className="mt-5 space-y-2.5 border-t border-line/70 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-stone">
            {formatCurrency(studio.hourlyRate)} × {formatDuration(duration)}
          </span>
          <span className="text-ink">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone">Security deposit</span>
          <span className="text-ink">
            {formatCurrency(studio.securityDeposit)}
          </span>
        </div>
        <div className="flex justify-between gap-4 border-t border-line/70 pt-2.5 text-base">
          <span className="font-medium text-ink">Estimated total</span>
          <span className="font-display text-xl tracking-[-0.03em] text-ink">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <Button
        className="mt-5 w-full"
        size="lg"
        onClick={handleBook}
        disabled={disabled}
      >
        Book Workspace Now
      </Button>

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-stone">
        <ShieldCheck
          className="mt-0.5 size-3.5 shrink-0 text-accent-deep"
          aria-hidden="true"
        />
        Free cancellation while your request is pending. The deposit is
        refundable after your session.
      </p>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        studio={studio}
        initial={{ date, startTime, endTime }}
      />
    </div>
  );
}
