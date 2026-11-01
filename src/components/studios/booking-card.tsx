"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/studios/booking-modal";
import { formatCurrency } from "@/lib/utils";

const BookingCard = ({ studio }: { studio: Studio }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [modalOpen, setModalOpen] = useState(false);

  const handleBook = () => {
    if (!user) {
      toast.info("Sign in to book this studio.");
      router.push(`/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`);
      return;
    }

    setModalOpen(true);
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(23,21,18,0.4)] sm:p-6">
      <p>
        <span className="font-display text-3xl tracking-[-0.04em] tabular-nums">
          {formatCurrency(studio.hourlyRate)}
        </span>
        <span className="text-sm text-stone"> / hour</span>
      </p>

      <p className="mt-3 text-xs leading-5 text-stone">
        Free cancellation while your request is pending. The deposit is
        refundable after your session.
      </p>

      <Button size="lg" className="mt-5 w-full" onClick={handleBook}>
        Book Workspace Now
      </Button>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        studio={studio}
      />
    </div>
  );
};

export { BookingCard };
