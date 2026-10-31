"use client";

import Link from "next/link";
import {
  Building2,
  Camera,
  Clapperboard,
  Mic,
  Music2,
  Palette,
  Video,
  type LucideIcon,
} from "lucide-react";
import { ABOUT_VALUES } from "@/lib/constants";
import { SmartImage } from "@/components/ui/smart-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonStyles } from "@/components/ui/button";

const audienceIcons: Record<string, LucideIcon> = {
  Photographers: Camera,
  Filmmakers: Clapperboard,
  Podcasters: Mic,
  Musicians: Music2,
  "Content creators": Video,
  Artists: Palette,
  "Studio owners": Building2,
};

const reasons = [
  {
    title: "Easy studio discovery",
    description:
      "Search by category, neighbourhood, price, capacity, amenities, and availability — all in one place, without a dozen tabs.",
  },
  {
    title: "Transparent pricing",
    description:
      "Hourly rates and security deposits are shown up front. You see the full estimate before you send a booking request.",
  },
  {
    title: "Flexible booking",
    description:
      "Pick the date and hours that suit your production. Short sessions and full shoot days are both welcome.",
  },
  {
    title: "Diverse creative spaces",
    description:
      "From cyc walls and broadcast stages to quiet podcast rooms, live music suites, and messy art workshops.",
  },
  {
    title: "Trusted host relationships",
    description:
      "Host profiles, verified details, and direct messaging make it easier to ask the right questions before you arrive.",
  },
];

export function AboutContent() {
  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <section className="shell shell-wide">
        <div>
          <p className="kicker">About StudioSpace</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <h1 className="text-balance font-display text-[clamp(2.9rem,6vw,5.8rem)] leading-[0.95] tracking-[-0.055em]">
              A Space for Every Creative Vision.
            </h1>
            <div>
              <p className="text-pretty text-[15px] leading-7 text-stone">
                StudioSpace connects creators with professional creative
                environments across New York — from daylight photo lofts and
                broadcast stages to podcast rooms, music suites, and art
                workshops.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/studios" className={buttonStyles()}>
                  Find a Space
                </Link>
                <Link
                  href="/add-studio"
                  className={buttonStyles({ variant: "outline" })}
                >
                  Become a Host
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand lg:aspect-[16/9]">
              <SmartImage
                src="/images/about/about-1.jpg"
                alt="Creators collaborating in a bright studio"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <div className="grid h-full gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand lg:aspect-auto lg:flex-1">
                <SmartImage
                  src="/images/about/about-2.jpg"
                  alt="A team planning a creative project"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-dark p-6 text-ivory">
                <p className="kicker kicker-light">Our promise</p>
                <p className="mt-3 font-display text-xl leading-tight tracking-[-0.02em]">
                  Transparent pricing. Thoughtful spaces. Real support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 border-y border-line bg-paper py-20">
        <div className="shell shell-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div>
              <p className="kicker">Our mission</p>
              <h2 className="mt-3 max-w-sm text-balance font-display text-3xl leading-[1.08] tracking-[-0.04em] sm:text-4xl">
                Make professional creative space feel within reach.
              </h2>
            </div>
          </div>
          <div>
            <div className="space-y-5 text-[15px] leading-8 text-stone">
              <p>
                StudioSpace started with a simple frustration: finding a
                professional space shouldn&apos;t mean a week of emails,
                favours, and guesswork. Creators needed a clear, trusted way to
                see what was available, what it cost, and what a space actually
                felt like. Hosts needed a better way to share the spaces they
                had already built.
              </p>
              <p>
                So we built a marketplace around transparency. Every listing
                shows real pricing, capacity, amenities, and availability.
                Every host has a profile. And every booking starts with a
                conversation, not a hidden fee.
              </p>
              <div className="grid grid-cols-3 gap-4 border-t border-line pt-6">
                <div>
                  <p className="font-display text-3xl tracking-[-0.04em]">
                    12
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">
                    Curated spaces
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl tracking-[-0.04em]">5</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">
                    Categories
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl tracking-[-0.04em]">
                    4.8
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">
                    Average rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="shell shell-wide">
          <div>
            <SectionHeading
              kicker="Who we serve"
              title="Built for every kind of maker."
              description="Different crafts need different rooms. StudioSpace is designed to help each one find the right fit."
            />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ABOUT_VALUES.map((value) => {
              const Icon = audienceIcons[value] ?? Camera;
              return (
                <div key={value}>
                  <div className="group rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/25">
                    <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-sm font-medium text-ink">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="shell shell-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker">Why StudioSpace</p>
            <h2 className="mt-3 max-w-sm text-balance font-display text-3xl leading-[1.08] tracking-[-0.04em] sm:text-4xl">
              Fewer hurdles between you and the work.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-stone">
              We focus on the details that make a rental feel effortless — for
              creators and hosts alike.
            </p>
          </div>
          <ul className="divide-y divide-line/70 border-t border-line/70">
            {reasons.map((reason, index) => (
              <li
                key={reason.title}
                className="grid grid-cols-[auto_1fr] gap-5 py-6"
              >
                <span className="font-display text-xs text-stone">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl tracking-[-0.02em]">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-stone">
                    {reason.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20">
        <div className="shell shell-wide">
          <div className="relative overflow-hidden rounded-3xl bg-dark px-6 py-16 text-center text-ivory sm:px-12 lg:py-20">
            <SmartImage
              src="/images/about/host-cta.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/30" />
            <div className="relative">
              <p className="kicker kicker-light">Start creating</p>
              <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.02] tracking-[-0.05em]">
                Find Your Creative Space.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ivory/60">
                Browse the marketplace, book by the hour, and get back to what
                you do best. Your next great session is a few clicks away.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/studios" className={buttonStyles({ size: "lg" })}>
                  Explore Studios
                </Link>
                <Link
                  href="/add-studio"
                  className={buttonStyles({ variant: "light", size: "lg" })}
                >
                  Become a Host
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
