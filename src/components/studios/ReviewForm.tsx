"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ReviewForm({ studioId }: { studioId: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.info("Sign in to review this studio.");
      router.push(
        `/login?next=${encodeURIComponent(`/studios/${studioId}`)}`,
      );
      return;
    }

    if (rating === 0) {
      toast.error("Pick a star rating first.");
      return;
    }
    if (!text.trim()) {
      toast.error("Write a few words about the space.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getTokenFromClient();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studios/${studioId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            text: text.trim(),
            name: user.name,
            email: user.email,
            avatar: user.image || "",
          }),
        },
      );

      if (!response.ok) {
        toast.error("Your review couldn't be posted. Please try again.");
        return;
      }

      toast.success("Thanks! Your review is now on this listing.");
      setRating(0);
      setText("");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6"
    >
      <p className="text-sm font-medium text-ink">Rate this space</p>

      <div
        role="radiogroup"
        aria-label="Your rating"
        className="mt-3 flex items-center gap-1"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            onClick={() => setRating(value)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "size-5",
                value <= rating ? "fill-accent text-accent" : "text-stone/40",
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <Textarea
        label="Your review"
        placeholder="How was the space, the light, the gear?"
        className="mt-4"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <Button
        type="submit"
        loading={isSubmitting}
        loadingText="Posting…"
        className="mt-4"
      >
        Post Review
      </Button>
    </form>
  );
}
