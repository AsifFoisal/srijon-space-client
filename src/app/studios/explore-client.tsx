"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Search,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import type {
  Filters,
  SortOption,
  Studio,
  StudioCategory,
} from "@/lib/types";
import {
  CATEGORY_VALUES,
  MAX_PRICE,
  SORT_OPTIONS,
  STUDIOS_PER_PAGE,
} from "@/lib/constants";
import { useMarketplace } from "@/context/marketplace-context";
import { FilterPanel } from "@/components/studios/filter-panel";
import { StudioCard } from "@/components/studios/studio-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { Skeleton, StudioGridSkeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import {
  formatTimeLabel,
  parseDate,
  timeToMinutes,
} from "@/lib/utils";

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "All Categories",
  minPrice: 0,
  maxPrice: MAX_PRICE,
  location: "",
  minCapacity: 0,
  rating: 0,
  amenities: [],
  date: "",
  startTime: "",
  endTime: "",
};

function isCategory(value: string | null): value is StudioCategory {
  return Boolean(value && (CATEGORY_VALUES as string[]).includes(value));
}

function countActiveFilters(filters: Filters) {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.category !== "All Categories") count += 1;
  if (filters.minPrice > 0 || filters.maxPrice < MAX_PRICE) count += 1;
  if (filters.location.trim()) count += 1;
  if (filters.minCapacity > 0) count += 1;
  if (filters.rating > 0) count += 1;
  if (filters.amenities.length > 0) count += 1;
  if (filters.date) count += 1;
  if (filters.startTime || filters.endTime) count += 1;
  return count;
}

function matchesFilters(studio: Studio, filters: Filters) {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = [
      studio.title,
      studio.category,
      studio.location,
      studio.address,
      studio.description,
      ...studio.amenities,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  if (
    filters.category !== "All Categories" &&
    studio.category !== filters.category
  ) {
    return false;
  }

  if (studio.hourlyRate < filters.minPrice) return false;
  if (studio.hourlyRate > filters.maxPrice) return false;

  const location = filters.location.trim().toLowerCase();
  if (location) {
    const haystack = `${studio.location} ${studio.address} ${studio.city}`.toLowerCase();
    if (!haystack.includes(location)) return false;
  }

  if (filters.minCapacity > 0 && studio.capacity < filters.minCapacity) {
    return false;
  }

  if (filters.rating > 0 && studio.rating < filters.rating) {
    return false;
  }

  if (
    filters.amenities.length > 0 &&
    !filters.amenities.every((amenity) => studio.amenities.includes(amenity))
  ) {
    return false;
  }

  if (filters.date) {
    const day = parseDate(filters.date).getDay();
    if (!studio.availableDays.includes(day)) return false;
  }

  if (
    filters.startTime &&
    timeToMinutes(filters.startTime) < timeToMinutes(studio.openTime)
  ) {
    return false;
  }

  if (
    filters.endTime &&
    timeToMinutes(filters.endTime) > timeToMinutes(studio.closeTime)
  ) {
    return false;
  }

  return true;
}

function sortStudios(studios: Studio[], sort: SortOption) {
  const sorted = [...studios];
  switch (sort) {
    case "Newest First":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "Price: Low to High":
      return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "Price: High to Low":
      return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "Highest Rated":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    case "Recommended":
    default:
      return sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount,
      );
  }
}

export function ExploreClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { studios, isReady } = useMarketplace();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isCategory(categoryParam)) return;
    // The URL is the external source of truth for the category link. When a
    // visitor arrives from a category card or footer link, mirror it into the
    // filter state once. This is a legitimate external-store sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((current) =>
      current.category === categoryParam
        ? current
        : { ...current, category: categoryParam },
    );
    setDraft((current) => ({ ...current, category: categoryParam }));
    setPage(1);
  }, [categoryParam]);

  const activeStudios = useMemo(
    () => studios.filter((studio) => studio.status === "Active"),
    [studios],
  );

  const filtered = useMemo(
    () =>
      sortStudios(
        activeStudios.filter((studio) => matchesFilters(studio, filters)),
        sort,
      ),
    [activeStudios, filters, sort],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / STUDIOS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * STUDIOS_PER_PAGE,
    safePage * STUDIOS_PER_PAGE,
  );
  const activeFilterCount = countActiveFilters(filters);

  function applyFilters(next: Filters = draft) {
    if (
      next.startTime &&
      next.endTime &&
      timeToMinutes(next.endTime) <= timeToMinutes(next.startTime)
    ) {
      toast.error("Your end time needs to be later than your start time.");
      return;
    }
    setFilters(next);
    setPage(1);
    setMobileFiltersOpen(false);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setDraft(DEFAULT_FILTERS);
    setPage(1);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/studios");
    }
  }

  function handleHeaderSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({ ...draft, search: draft.search });
  }

  return (
    <>
      <section className="bg-dark pb-14 pt-28 text-ivory sm:pt-32">
        <div className="shell shell-wide">
          <nav
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ivory/40"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-ivory">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ivory/70">Explore Studios</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="kicker kicker-light">The marketplace</p>
              <h1 className="mt-3 text-balance font-display text-[clamp(2.7rem,5.5vw,4.8rem)] leading-[0.96] tracking-[-0.05em]">
                Explore Creative Spaces
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-ivory/60">
                Find the perfect environment for your next project, shoot,
                recording session, or creative collaboration.
              </p>
            </div>
            <p className="text-sm text-ivory/50">
              <span className="font-display text-3xl text-white">
                {isReady ? activeStudios.length : 12}
              </span>{" "}
              spaces available
            </p>
          </div>

          <form
            onSubmit={handleHeaderSearch}
            className="mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 pl-5 backdrop-blur"
            role="search"
          >
            <Search
              className="size-4 shrink-0 text-ivory/40"
              aria-hidden="true"
            />
            <label htmlFor="explore-search" className="sr-only">
              Search studios
            </label>
            <input
              id="explore-search"
              value={draft.search}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              placeholder="Search by studio, category, or neighbourhood"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/35 focus:outline-none"
            />
            <button
              type="submit"
              className={buttonStyles({ size: "sm" })}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="shell shell-wide">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-line bg-paper/70 p-5">
                <FilterPanel
                  value={draft}
                  onChange={setDraft}
                  onApply={() => applyFilters()}
                  onClear={clearFilters}
                  resultCount={filtered.length}
                />
              </div>
            </aside>

            <div>
              <div className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-display text-lg tracking-[-0.02em]">
                    {isReady ? (
                      <>
                        {filtered.length} space
                        {filtered.length === 1 ? "" : "s"} found
                      </>
                    ) : (
                      <Skeleton className="h-6 w-40" />
                    )}
                  </div>
                  {activeFilterCount > 0 ? (
                    <p className="mt-1 text-xs text-stone">
                      {activeFilterCount} active filter
                      {activeFilterCount === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-medium text-ink transition-colors hover:border-ink/30 lg:hidden"
                  >
                    <SlidersHorizontal
                      className="size-4"
                      aria-hidden="true"
                    />
                    Filters
                    {activeFilterCount > 0 ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </button>

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
                      value={sort}
                      onChange={(event) => {
                        setSort(event.target.value as SortOption);
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
                {!isReady ? (
                  <StudioGridSkeleton count={6} />
                ) : visible.length === 0 ? (
                  <EmptyState
                    icon={<SearchX className="size-6" aria-hidden="true" />}
                    title="No Spaces Found."
                    description="Nothing matches that combination of filters just yet. Try widening your price range, choosing another day, or exploring all studios."
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
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {visible.map((studio, index) => (
                        <div key={studio.id} className="h-full">
                          <StudioCard studio={studio} priority={index === 0} />
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-4">
                      <p className="text-xs text-stone">
                        Showing{" "}
                        {(safePage - 1) * STUDIOS_PER_PAGE + 1}–
                        {Math.min(
                          safePage * STUDIOS_PER_PAGE,
                          filtered.length,
                        )}{" "}
                        of {filtered.length} spaces
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
          </div>
        </div>
      </section>

      <Modal
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filters"
        description="Refine the marketplace to match your next project."
        size="lg"
      >
        <FilterPanel
          value={draft}
          onChange={setDraft}
          onApply={() => applyFilters()}
          onClear={clearFilters}
          resultCount={filtered.length}
          hideHeader
        />
        <p className="mt-4 text-center text-xs text-stone">
          {filtered.length} space{filtered.length === 1 ? "" : "s"} match your
          current filters
          {filters.startTime || filters.endTime
            ? ` · ${filters.startTime ? formatTimeLabel(filters.startTime) : "Any"}–${filters.endTime ? formatTimeLabel(filters.endTime) : "Any"}`
            : ""}
        </p>
      </Modal>
    </>
  );
}
