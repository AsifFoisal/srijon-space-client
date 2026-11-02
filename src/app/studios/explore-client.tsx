"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Search,
  SearchX,
  X,
} from "lucide-react";
import type { Studio, StudioCategory } from "@/lib/types";
import {
  CATEGORY_VALUES,
  SORT_OPTIONS,
  STUDIOS_PER_PAGE,
} from "@/lib/constants";
import { StudioCard } from "@/components/studios/studio-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS: (StudioCategory | "All Categories")[] = [
  "All Categories",
  ...CATEGORY_VALUES,
];

const RESULTS_GRID = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function isCategory(value: string | null): value is StudioCategory {
  return Boolean(value && (CATEGORY_VALUES as string[]).includes(value));
}

export function ExploreClient({ studios }: { studios: Studio[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StudioCategory | "All Categories">(
    "All Categories",
  );
  const [sortOrder, setSortOrder] = useState("Recommended");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isCategory(categoryParam)) return;
    // The URL is the external source of truth for the category link. When a
    // visitor arrives from a category card or footer link, mirror it into the
    // local filter state once. This is a legitimate external-store sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory((current) =>
      current === categoryParam ? current : categoryParam,
    );
    setPage(1);
  }, [categoryParam]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return studios.filter((studio) => {
      if (category !== "All Categories" && studio.category !== category) {
        return false;
      }
      if (!query) return true;
      const haystack = [
        studio.title,
        studio.category,
        studio.address,
        studio.description,
        ...studio.amenities,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [studios, search, category]);

  const sortedProducts = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (sortOrder === "Newest First") {
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        } else if (sortOrder === "Price: Low to High") {
          return a.hourlyRate - b.hourlyRate;
        } else if (sortOrder === "Price: High to Low") {
          return b.hourlyRate - a.hourlyRate;
        } else if (sortOrder === "Highest Rated") {
          return (
            (b.rating ?? 0) - (a.rating ?? 0) ||
            (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
          );
        } else {
          // "Recommended" / default
          return (
            (b.rating ?? 0) - (a.rating ?? 0) ||
            (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
          );
        }
      }),
    [filtered, sortOrder],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / STUDIOS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const visible = sortedProducts.slice(
    (safePage - 1) * STUDIOS_PER_PAGE,
    safePage * STUDIOS_PER_PAGE,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function clearSearch() {
    setSearch("");
    setPage(1);
  }

  function selectCategory(next: StudioCategory | "All Categories") {
    setCategory(next);
    setPage(1);
    const url =
      next === "All Categories"
        ? "/studios"
        : `/studios?category=${encodeURIComponent(next)}`;
    window.history.replaceState(null, "", url);
  }

  function clearFilters() {
    setSearch("");
    setCategory("All Categories");
    setPage(1);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/studios");
    }
  }

  return (
    <>
      <section className="bg-dark pb-14 pt-28 text-on-dark sm:pt-32">
        <div className="shell shell-wide">
          <nav
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-on-dark/40"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-on-dark">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-on-dark/70">Explore Studios</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="kicker kicker-light">The marketplace</p>
              <h1 className="mt-3 text-balance font-display text-[clamp(2.7rem,5.5vw,4.8rem)] leading-[0.96] tracking-[-0.05em]">
                Explore Creative Spaces
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-on-dark/60">
                Find the perfect environment for your next project, shoot,
                recording session, or creative collaboration.
              </p>
            </div>
            <p className="text-sm text-on-dark/50">
              <span className="font-display text-3xl text-white">
                {studios.length}
              </span>{" "}
              spaces available
            </p>
          </div>

          <div role="search" className="relative mt-8 w-full max-w-2xl">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-on-dark/40"
              aria-hidden="true"
            />
            <label htmlFor="explore-search" className="sr-only">
              Search studios
            </label>
            <input
              id="explore-search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by studio, category, or neighbourhood"
              className="h-14 w-full rounded-full border border-white/15 bg-white/[0.06] pl-12 pr-14 text-sm text-on-dark backdrop-blur transition-colors placeholder:text-on-dark/35 hover:border-white/25 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {search ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-on-dark/45 transition-colors hover:bg-white/10 hover:text-on-dark"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="shell shell-wide">
          <div
            className="flex flex-wrap items-center gap-2 pb-6"
            role="group"
            aria-label="Filter by category"
          >
            {CATEGORY_OPTIONS.map((option) => {
              const active = category === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectCategory(option)}
                  aria-pressed={active}
                  className={cn(
                    "h-9 rounded-full border px-4 text-[13px] font-medium transition-colors",
                    active
                      ? "border-ink bg-ink text-ivory"
                      : "border-line bg-paper text-stone hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-display text-lg tracking-[-0.02em]">
              {filtered.length} space
              {filtered.length === 1 ? "" : "s"} found
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <ArrowDownWideNarrow
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone"
                  aria-hidden="true"
                />
                <label htmlFor="sort-studios" className="sr-only">
                  Sort studios
                </label>
                <select
                  id="sort-studios"
                  value={sortOrder}
                  onChange={(event) => {
                    setSortOrder(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 appearance-none rounded-full border border-line bg-paper pl-10 pr-9 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-stone"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            {visible.length === 0 ? (
              <EmptyState
                icon={<SearchX className="size-6" aria-hidden="true" />}
                title="No Spaces Found."
                description="Nothing matches that search just yet. Try a different keyword or explore another category."
              >
                <button
                  type="button"
                  onClick={clearFilters}
                  className={buttonStyles()}
                >
                  Clear Filters
                </button>
                <Link
                  href="/studios"
                  onClick={clearFilters}
                  className={buttonStyles({ variant: "outline" })}
                >
                  Explore All Studios
                </Link>
              </EmptyState>
            ) : (
              <>
                <div className={cn("grid gap-6", RESULTS_GRID)}>
                  {visible.map((studio, index) => (
                    <div key={studio._id} className="h-full">
                      <StudioCard studio={studio} priority={index === 0} />
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex flex-col items-center gap-4">
                  <p className="text-xs text-stone">
                    Showing {(safePage - 1) * STUDIOS_PER_PAGE + 1}–
                    {Math.min(safePage * STUDIOS_PER_PAGE, filtered.length)} of{" "}
                    {filtered.length} spaces
                  </p>
                  <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => {
                      setPage(nextPage);
                      window.scrollTo({ top: 260, behavior: "smooth" });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
