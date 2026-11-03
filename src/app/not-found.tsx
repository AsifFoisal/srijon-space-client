"use client";

import Link from "next/link";
import { ArrowUpRight, Aperture } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonStyles } from "@/components/ui/button";
import { STUDIO_CATEGORIES } from "@/lib/constants";

const suggestions = STUDIO_CATEGORIES.slice(0, 3);

export default function NotFound() {
  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <div className="shell shell-wide">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-stone">
              <Aperture className="size-4 text-accent" aria-hidden="true" />
              Error 404
            </p>
            <h1 className="mt-4 text-balance font-display text-[clamp(2.7rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.05em]">
              Looks Like This Space Doesn&apos;t Exist.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-stone">
              The creative space you&apos;re looking for may have moved, been
              removed, or never existed. Let&apos;s find you somewhere better to
              make something great.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className={buttonStyles({ size: "lg" })}>
                Return to Home
              </Link>
              <Link
                href="/studios"
                className={buttonStyles({ variant: "outline", size: "lg" })}
              >
                Explore Studios
              </Link>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl bg-dark lg:aspect-[4/3]">
            <SmartImage
              src="/images/studios/cyc-studio.jpg"
              alt="An empty photography studio with softboxes and a backdrop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-outline-light font-display text-[clamp(7rem,20vw,13rem)] leading-none tracking-[-0.06em]">
                404
              </span>
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-dark/60 p-4 backdrop-blur-md sm:inset-x-7 sm:bottom-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-dark/45">
                Still looking?
              </p>
              <p className="mt-1.5 text-sm leading-6 text-on-dark/80">
                The best spaces go fast. Browse the marketplace and book the
                room your next project deserves.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <p className="kicker">Or start from a category</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {suggestions.map((category) => (
              <Link
                key={category.value}
                href={`/studios?category=${encodeURIComponent(category.value)}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-3 transition-colors hover:border-ink/30"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <SmartImage
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-stone">
                    Category
                  </p>
                  <p className="mt-0.5 truncate font-display text-lg tracking-[-0.02em]">
                    {category.title}
                  </p>
                </div>
                <ArrowUpRight
                  className="size-4 shrink-0 text-stone transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
