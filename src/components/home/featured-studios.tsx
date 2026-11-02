import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Studio } from "@/lib/types";
import { StudioCard } from "@/components/studios/studio-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

export async function FeaturedStudios() {
  let studios: Studio[] = [];

  try {
    const token = await getTokenFromServer();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/studios?limit=6`,
      {
        cache: "no-store",
        headers: { authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error("Failed to load featured studios");
    studios = await response.json();
    if (!Array.isArray(studios)) throw new Error("Invalid studios data");
  } catch {
    return (
      <p role="status" className="py-16 text-center text-stone">
        Featured studios are unavailable right now. Please try again later.
      </p>
    );
  }

  const featured = [...studios]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    )
    .slice(0, 6);

  if (featured.length === 0) {
    return (
      <p className="py-16 text-center text-stone">
        New studios are on their way. Check back soon!
      </p>
    );
  }

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
              className="inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink/20 bg-transparent px-6 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink/50 hover:bg-ink/[0.04]"
            >
              View all studios
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((studio, index) => (
            <div key={studio._id} className="h-full">
              <StudioCard studio={studio} priority={index < 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
