"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { TIME_OPTIONS } from "@/lib/constants";
import {
  durationInHours,
  formatCurrency,
  formatTimeLabel,
  todayISO,
} from "@/lib/utils";

const BookingCard = ({ studio }: { studio: Studio }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.info("Sign in to book this studio.");
      router.push(`/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`);
      return;
    }

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
      username: user.name,
      email: user.email,
      userEmail: user.email,
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const bookingRes = await res.json().catch(() => null);

    if (!res.ok) {
      toast.error(bookingRes?.message || "Failed to send your booking request.");
      return;
    }

    toast.success("Booking request sent. Track it in My Bookings.");
    router.push("/my-bookings");
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(23,21,18,0.4)] sm:p-6">
      <p>
        <span className="font-display text-3xl tracking-[-0.04em] tabular-nums">
          {formatCurrency(studio.hourlyRate)}
        </span>
        <span className="text-sm text-stone"> / hour</span>
      </p>

      <form onSubmit={handleBooking} className="mt-5 grid gap-3">
        <Input
          label="Date"
          type="date"
          name="date"
          min={todayISO()}
          defaultValue={todayISO()}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Start time" name="startTime" defaultValue="10:00" required>
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

        <Button type="submit" size="lg" className="mt-1 w-full">
          Book Workspace Now
        </Button>
      </form>

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-stone">
        <ShieldCheck
          className="mt-0.5 size-3.5 shrink-0 text-accent-deep"
          aria-hidden="true"
        />
        Free cancellation while your request is pending. The deposit is
        refundable after your session.
      </p>
    </div>
  );
};

export { BookingCard };
