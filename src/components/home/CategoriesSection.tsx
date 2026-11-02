"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STUDIO_CATEGORIES } from "@/lib/constants";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { SmartImage } from "@/components/ui/smart-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, pluralize } from "@/lib/utils";

export function CategoriesSection() {
  const [studios, setStudios] = useState<Array<{ category: string }> | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      const token = await getTokenFromClient();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studios`,
        {
          cache: "no-store",
          headers: { authorization: `Bearer ${token}` },
        },
      ).catch(() => null);
      if (!response || !response.ok) {
        if (active) setStudios([]);
        return;
      }

      const data = await response.json().catch(() => null);
      if (active) setStudios(Array.isArray(data) ? data : []);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const countFor = (category: string) =>
    studios === null
      ? null
      : studios.filter((studio) => studio.category === category).length;

  return (
    <section
      id="categories"
      className="scroll-mt-24 border-y border-line/70 bg-paper py-20 lg:py-28"
    >
      <div className="shell shell-wide">
        <SectionHeading
          kicker="Browse by category"
          title="Find Your Creative Environment"
          description="Whatever your craft, there's a space designed for it."
        />

        <div className="mt-11 flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {STUDIO_CATEGORIES.map((category, index) => {
            const count = countFor(category.value);

            return (
              <div
                key={category.value}
                className={cn(
                  "min-w-[82%] snap-start sm:min-w-[46%] lg:min-w-0",
                  index < 2 ? "lg:col-span-3" : "lg:col-span-2",
                )}
              >
                <Link
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="group relative flex h-[300px] flex-col justify-end overflow-hidden rounded-2xl bg-dark p-6 text-on-dark lg:h-[340px]"
                >
                  <SmartImage
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 1024px) 82vw, 33vw"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/35 to-dark/5" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-on-dark/45">
                        0{index + 1}
                      </span>
                      <span className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
                        <ArrowUpRight
                          className="size-4"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl tracking-[-0.03em] lg:text-3xl">
                      {category.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 max-w-sm text-sm leading-6 text-on-dark/60">
                      {category.description}
                    </p>
                    <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-on-dark/40">
                      {count === null ? (
                        <Skeleton className="h-3 w-24 bg-white/10" />
                      ) : (
                        `${pluralize(count, "space")} available`
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
