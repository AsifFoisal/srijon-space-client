"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Studio } from "@/lib/types";
import { StudioCard } from "@/components/studios/studio-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StudioGridSkeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setStudios(
          list.map((studio: Studio) => ({
            ...studio,
            hourlyRate: Number(studio.hourlyRate) || 0,
            securityDeposit: Number(studio.securityDeposit) || 0,
            capacity: Number(studio.capacity) || 0,
          })),
        );
      })
      .catch(() => {
        if (active) setStudios([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featured = [...studios]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    )
    .slice(0, 6);

  return (
    <section className="py-20 lg:py-28">
      <div className="shell shell-wide">
        <SectionHeading
          kicker="Featured spaces"
          title="Spaces Worth Creating In"
          description="Explore some of the most inspiring creative spaces available on Srijon Space."
          action={
            <Link
              href="/studios"
              className={buttonStyles({ variant: "outline" })}
            >
              View all studios
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-12">
          {loading ? (
            <StudioGridSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((studio, index) => (
                <div key={studio._id} className="h-full">
                  <StudioCard studio={studio} priority={index < 3} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
