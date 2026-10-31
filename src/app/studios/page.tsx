import { Suspense } from "react";
import { ExploreClient } from "./explore-client";
import { Skeleton, StudioGridSkeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Explore Studios",
  description:
    "Browse photo studios, film stages, podcast rooms, music suites, and art workshops available on StudioSpace.",
};

function ExploreFallback() {
  return (
    <>
      <section className="bg-dark pb-14 pt-28 sm:pt-32">
        <div className="shell shell-wide">
          <Skeleton className="h-3 w-40 bg-white/10" />
          <Skeleton className="mt-8 h-14 w-full max-w-2xl bg-white/10" />
          <Skeleton className="mt-5 h-4 w-full max-w-xl bg-white/10" />
          <Skeleton className="mt-8 h-14 w-full max-w-2xl rounded-full bg-white/10" />
        </div>
      </section>
      <section className="py-10 lg:py-14">
        <div className="shell shell-wide">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <Skeleton className="hidden h-[560px] w-full rounded-2xl lg:block" />
            <StudioGridSkeleton count={6} />
          </div>
        </div>
      </section>
    </>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExploreClient />
    </Suspense>
  );
}
