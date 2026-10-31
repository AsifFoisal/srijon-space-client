"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { readJSON, STORAGE_KEYS, writeJSON } from "@/lib/storage";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address to subscribe.");
      return;
    }

    const subscribers = readJSON<string[]>(STORAGE_KEYS.newsletter, []);
    if (!subscribers.includes(value.toLowerCase())) {
      writeJSON(STORAGE_KEYS.newsletter, [...subscribers, value.toLowerCase()]);
    }

    setError("");
    setEmail("");
    toast.success("You're on the list. Watch your inbox for studio drops.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("w-full", className)}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border bg-white/[0.06] p-1.5 pl-5 transition-colors focus-within:border-white/40",
          error ? "border-accent/40" : "border-white/15",
        )}
      >
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          placeholder="you@studio.com"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/35 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Subscribe</span>
        </button>
      </div>
      {error ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs text-accent-soft">
          {error}
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-ivory/35">
          One thoughtful email a month. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
