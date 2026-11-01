"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TIME_OPTIONS } from "@/lib/constants";
import {
  durationInHours,
  formatTimeLabel,
  todayISO,
} from "@/lib/utils";

const BookingModal = ({
  open,
  onClose,
  studio,
}: {
  open: boolean;
  onClose: () => void;
  studio: Studio;
}) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as unknown as Record<string, { value: string }>;
    const date = form.date.value;
    const startTime = form.startTime.value;
    const endTime = form.endTime.value;
    const attendees = form.attendees.value;

    const duration = durationInHours(startTime, endTime);
    if (duration <= 0) {
      toast.error("Your end time needs to be after your start time.");
      return;
    }

    const subtotal = Math.round(studio.hourlyRate * duration * 100) / 100;

    const data = {
      studioId: studio._id,
      studioTitle: studio.title,
      studioImage: studio.imageUrl,
      category: studio.category,
      address: studio.address,
      username: user?.name ?? "",
      email: user?.email ?? "",
      userEmail: user?.email ?? "",
      date,
      startTime,
      endTime,
      durationHours: duration,
      attendees: Number(attendees),
      hourlyRate: studio.hourlyRate,
      subtotal,
      securityDeposit: studio.securityDeposit,
      total: Math.round((subtotal + studio.securityDeposit) * 100) / 100,
      status: "Pending",
      bookingDate: new Date(),
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const bookingRes = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(
          bookingRes?.message || "Failed to send your booking request.",
        );
        return;
      }

      toast.success("Booking request sent. Track it in My Bookings.");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Book this studio"
      description={`${studio.title} · ${studio.address}`}
      size="lg"
    >
      {/* key remounts the form each time the modal opens, resetting the fields */}
      <form key={String(open)} onSubmit={handleBooking} className="grid gap-4">
        <Input
          label="Booking date"
          type="date"
          name="date"
          min={todayISO()}
          defaultValue={todayISO()}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Start time"
            name="startTime"
            defaultValue="10:00"
            required
          >
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {formatTimeLabel(time)}
              </option>
            ))}
          </Select>

          <Select label="End time" name="endTime" defaultValue="12:00" required>
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {formatTimeLabel(time)}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Number of attendees"
          type="number"
          name="attendees"
          min={1}
          max={studio.capacity}
          hint={`This space hosts up to ${studio.capacity} guests.`}
          defaultValue="1"
          required
        />

        <Textarea
          label="Project description (optional)"
          name="projectDescription"
          placeholder="Tell the host what you're planning — crew size, equipment, set needs…"
        />

        <p className="text-xs leading-5 text-stone">
          No payment is collected online. Your request will appear as{" "}
          <span className="font-medium text-ink">Pending</span> in My Bookings,
          and the host can confirm availability.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            loadingText="Sending request…"
          >
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { BookingModal };
