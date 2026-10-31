"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMarketplace } from "@/context/marketplace-context";
import { StudioCard } from "@/components/studios/studio-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StudioGridSkeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";

export function FeaturedStudios() {
  const { studios, isReady } = useMarketplace();
  const featured = [...studios]
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || b.rating - a.rating,
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
          {!isReady ? (
            <StudioGridSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((studio, index) => (
                <div key={studio.id} className="h-full">
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
