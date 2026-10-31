"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useMarketplace } from "@/context/marketplace-context";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import { TIME_OPTIONS } from "@/lib/constants";
import {
  durationInHours,
  formatCurrency,
  formatDateLabel,
  formatDuration,
  formatTimeLabel,
  parseDate,
  timeToMinutes,
  todayISO,
} from "@/lib/utils";

interface BookingFormValues {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  projectDescription: string;
}

export function BookingModal({
  open,
  onClose,
  studio,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  studio: Studio;
  initial: { date: string; startTime: string; endTime: string };
}) {
  const { user } = useAuth();
  const { addBooking } = useMarketplace();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: {
      date: initial.date,
      startTime: initial.startTime,
      endTime: initial.endTime,
      attendees: 1,
      projectDescription: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      date: initial.date,
      startTime: initial.startTime,
      endTime: initial.endTime,
      attendees: 1,
      projectDescription: "",
    });
  }, [open, initial.date, initial.startTime, initial.endTime, reset]);

  const values = watch();
  const duration =
    values.startTime && values.endTime
      ? durationInHours(values.startTime, values.endTime)
      : 0;
  const subtotal = Math.round(studio.hourlyRate * duration * 100) / 100;
  const total = Math.round((subtotal + studio.securityDeposit) * 100) / 100;
  const timeOptions = TIME_OPTIONS.filter(
    (time) =>
      timeToMinutes(time) >= timeToMinutes(studio.openTime) &&
      timeToMinutes(time) <= timeToMinutes(studio.closeTime),
  );

  async function onSubmit(data: BookingFormValues) {
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      return;
    }

    try {
      await addBooking(
        studio,
        {
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          attendees: Number(data.attendees),
          projectDescription: data.projectDescription,
        },
        user,
      );
      toast.success("Booking request sent. Track it in My Bookings.");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Book this studio"
      description={`${studio.title} · ${studio.location}`}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Booking date"
            type="date"
            min={todayISO()}
            error={errors.date?.message}
            containerClassName="sm:col-span-2"
            {...register("date", {
              required: "Choose a booking date.",
              validate: (value) =>
                !value ||
                studio.availableDays.includes(parseDate(value).getDay()) ||
                "The studio is closed on this day. Please pick another date.",
            })}
          />

          <Select
            label="Start time"
            error={errors.startTime?.message}
            {...register("startTime", {
              required: "Choose a start time.",
              validate: (value, formValues) =>
                durationInHours(value, formValues.endTime) > 0 ||
                "Your end time needs to be after your start time.",
            })}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {formatTimeLabel(time)}
              </option>
            ))}
          </Select>

          <Select
            label="End time"
            error={errors.endTime?.message}
            {...register("endTime", {
              required: "Choose an end time.",
              validate: (value, formValues) =>
                durationInHours(formValues.startTime, value) > 0 ||
                "Your end time needs to be after your start time.",
            })}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {formatTimeLabel(time)}
              </option>
            ))}
          </Select>

          <Input
            label="Number of attendees"
            type="number"
            min={1}
            max={studio.capacity}
            error={errors.attendees?.message}
            hint={`This space hosts up to ${studio.capacity} guests.`}
            {...register("attendees", {
              required: "Let us know how many people are coming.",
              valueAsNumber: true,
              min: { value: 1, message: "At least one attendee is required." },
              max: {
                value: studio.capacity,
                message: `This studio hosts up to ${studio.capacity} guests.`,
              },
            })}
          />

          <Textarea
            label="Project description (optional)"
            placeholder="Tell the host what you're planning — crew size, equipment, set needs…"
            hint="A short note helps the host prepare the space."
            className="min-h-24"
            containerClassName="sm:col-span-2"
            {...register("projectDescription", {
              maxLength: {
                value: 500,
                message: "Keep your note under 500 characters.",
              },
            })}
          />
        </div>

        {errors.projectDescription?.message ? (
          <p className="mt-2 text-xs text-accent-deep">
            {errors.projectDescription.message}
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl border border-line bg-ivory/70 p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-lg tracking-[-0.02em]">
              Booking summary
            </h3>
            <StatusBadge status="Pending" />
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Studio</dt>
              <dd className="text-right font-medium text-ink">
                {studio.title}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Date</dt>
              <dd className="text-ink">
                {values.date
                  ? formatDateLabel(values.date, "EEE, MMM d, yyyy")
                  : "Choose a date"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Time</dt>
              <dd className="text-ink">
                {values.startTime && values.endTime
                  ? `${formatTimeLabel(values.startTime)} – ${formatTimeLabel(values.endTime)}`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Duration</dt>
              <dd className="text-ink">{formatDuration(duration)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Hourly rate</dt>
              <dd className="text-ink">
                {formatCurrency(studio.hourlyRate)} / hr
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Rental subtotal</dt>
              <dd className="text-ink">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Security deposit</dt>
              <dd className="text-ink">
                {formatCurrency(studio.securityDeposit)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
              <dt className="font-medium text-ink">Estimated total</dt>
              <dd className="font-display text-xl text-ink">
                {formatCurrency(total)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 text-xs leading-5 text-stone">
          No payment is taken in this demo. Your request will appear as{" "}
          <span className="font-medium text-ink">Pending</span> in My Bookings,
          and the host can confirm availability.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} loadingText="Sending request…">
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}
