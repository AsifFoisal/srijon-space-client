"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/studios/booking-modal";
import { TIME_OPTIONS } from "@/lib/constants";
import {
  durationInHours,
  formatCurrency,
  formatDuration,
  formatTimeLabel,
  todayISO,
} from "@/lib/utils";

export function BookingCard({ studio }: { studio: Studio }) {
  const router = useRouter();
  const { user } = useAuth();
  const [date, setDate] = useState(todayISO);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [modalOpen, setModalOpen] = useState(false);

  const duration = durationInHours(startTime, endTime);
  const subtotal = Math.round(studio.hourlyRate * duration * 100) / 100;
  const total = Math.round((subtotal + studio.securityDeposit) * 100) / 100;
  const invalidTime = duration <= 0;
  const disabled = invalidTime;

  function handleBook() {
    if (!user) {
      toast.info("Sign in to book this studio.");
      router.push(
        `/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`,
      );
      return;
    }

    if (disabled) {
      toast.error("Please choose an end time after your start time.");
      return;
    }

    setModalOpen(true);
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(23,21,18,0.4)] sm:p-6">
      <p>
        <span className="font-display text-3xl tracking-[-0.04em]">
          {formatCurrency(studio.hourlyRate)}
        </span>
        <span className="text-sm text-stone"> / hour</span>
      </p>

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
              {TIME_OPTIONS.map((time) => (
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
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {formatTimeLabel(time)}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

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
