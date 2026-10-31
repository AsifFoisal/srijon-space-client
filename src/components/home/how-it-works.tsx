"use client";

import {
  BadgeCheck,
  CalendarClock,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Search,
    title: "Discover Spaces",
    description:
      "Explore professional creative environments and find the perfect studio for your project.",
  },
  {
    icon: CalendarClock,
    title: "Select Shoot Hours",
    description:
      "Choose your preferred date, available time slot, and required booking duration.",
  },
  {
    icon: BadgeCheck,
    title: "Book Instantly",
    description:
      "Review transparent pricing, booking details, and submit your reservation request.",
  },
  {
    icon: Sparkles,
    title: "Create & Produce",
    description:
      "Arrive at your selected studio and bring your creative vision to life.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-dark py-20 text-on-dark lg:py-28"
    >
      <div className="shell shell-wide">
        <div>
          <SectionHeading
            light
            kicker="How booking works"
            title="From Discovery to Creation"
            description="Booking your next creative space is easier than ever."
          />
        </div>

        <div className="relative mt-14">
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-white/15 lg:block"
            aria-hidden="true"
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title}>
                <div className="group relative">
                  <div className="flex items-center gap-4">
                    <span className="relative z-10 flex size-14 items-center justify-center rounded-full border border-white/15 bg-dark-soft font-display text-base text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <step.icon
                      className="size-5 text-on-dark/35 transition-colors duration-300 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-on-dark/55">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
