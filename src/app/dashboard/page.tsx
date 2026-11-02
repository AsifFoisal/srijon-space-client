import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  CalendarX2,
  CheckCircle2,
  Clock3,
  PlusCircle,
  Search,
} from "lucide-react";
import type { Booking, Studio } from "@/lib/types";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { SmartImage } from "@/components/ui/smart-image";
import { Skeleton, StatRowSkeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import {
  formatCurrency,
  formatDateLabel,
  formatTimeLabel,
} from "@/lib/utils";

const quickActions = [
  {
    label: "Add New Studio",
    description: "List a new creative space in a few minutes.",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    label: "Explore Studios",
    description: "Browse the marketplace for your next project.",
    href: "/studios",
    icon: Search,
  },
  {
    label: "My Studio Listings",
    description: "Update pricing, images, and availability.",
    href: "/my-listings",
    icon: Building2,
  },
  {
    label: "My Bookings",
    description: "Track requests and manage upcoming sessions.",
    href: "/my-bookings",
    icon: CalendarCheck,
  },
];

async function getDashboardData(email: string) {
  const token = await getTokenFromServer();

  const [studiosResponse, bookingsResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-studios/${email}`, {
      cache: "no-store",
      headers: { authorization: `Bearer ${token}` },
    }).catch(() => null),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${email}`, {
      cache: "no-store",
      headers: { authorization: `Bearer ${token}` },
    }).catch(() => null),
  ]);

  const studiosData =
    studiosResponse && studiosResponse.ok
      ? await studiosResponse.json().catch(() => null)
      : null;
  const bookingsData =
    bookingsResponse && bookingsResponse.ok
      ? await bookingsResponse.json().catch(() => null)
      : null;

  const studios: Studio[] = (
    Array.isArray(studiosData) ? studiosData : []
  ).map((studio: Studio) => ({
    ...studio,
    hourlyRate: Number(studio.hourlyRate) || 0,
  }));

  return {
    studios,
    bookings: Array.isArray(bookingsData) ? (bookingsData as Booking[]) : [],
  };
}

async function DashboardContent() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const user = session.user;
  const { studios: listings, bookings } = await getDashboardData(user.email);

  const pending = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;
  const completed = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;
  const recentBookings = [...bookings]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 3);
  const recentListings = [...listings]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    )
    .slice(0, 3);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <DashboardPageHeader
        kicker="Your dashboard"
        title={`Good to see you, ${firstName}.`}
        description="A single view of your listings, bookings, and the spaces you're keeping an eye on."
        action={
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/studios"
              className={buttonStyles({ variant: "outline" })}
            >
              Explore Studios
            </Link>
            <Link href="/add-studio" className={buttonStyles()}>
              <PlusCircle className="size-4" aria-hidden="true" />
              Add New Studio
            </Link>
          </div>
        }
      />

      <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-dark p-6 text-on-dark sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.image || undefined}
            name={user.name}
            size={64}
            className="border-2 border-white/15"
          />
          <div>
            <p className="font-display text-2xl tracking-[-0.03em]">
              {user.name}
            </p>
            <p className="text-sm text-on-dark/55">{user.email}</p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-on-dark/35">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-on-dark/70">
            Creator
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-on-dark/70">
            Host
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total listings"
            value={listings.length}
            hint="Spaces you manage"
            icon={Building2}
          />
          <StatCard
            label="Total bookings"
            value={bookings.length}
            hint="Across all statuses"
            icon={CalendarCheck}
          />
          <StatCard
            label="Pending requests"
            value={pending}
            hint="Awaiting confirmation"
            icon={Clock3}
          />
          <StatCard
            label="Completed"
            value={completed}
            hint="Finished sessions"
            icon={CheckCircle2}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-line bg-paper">
          <header className="flex items-center justify-between border-b border-line/70 px-5 py-4">
            <h2 className="font-display text-lg tracking-[-0.02em]">
              Recent bookings
            </h2>
            <Link
              href="/my-bookings"
              className="text-xs font-medium text-accent-deep transition-colors hover:text-accent"
            >
              View all
            </Link>
          </header>

          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <CalendarX2
                className="size-7 text-stone"
                aria-hidden="true"
              />
              <p className="mt-3 font-medium text-ink">No bookings yet</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-stone">
                Find a space that fits your next project and your first
                booking will appear here.
              </p>
              <Link
                href="/studios"
                className={buttonStyles({
                  variant: "outline",
                  size: "sm",
                  className: "mt-4",
                })}
              >
                Explore Studios
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-line/60">
              {recentBookings.map((booking) => (
                <Link
                  key={booking._id}
                  href="/my-bookings"
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ivory/60"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                    <SmartImage
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {booking.studioTitle}
                    </p>
                    <p className="mt-1 text-xs text-stone">
                      {formatDateLabel(booking.date, "MMM d")} ·{" "}
                      {formatTimeLabel(booking.startTime)} –{" "}
                      {formatTimeLabel(booking.endTime)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-paper">
          <header className="flex items-center justify-between border-b border-line/70 px-5 py-4">
            <h2 className="font-display text-lg tracking-[-0.02em]">
              Recent listings
            </h2>
            <Link
              href="/my-listings"
              className="text-xs font-medium text-accent-deep transition-colors hover:text-accent"
            >
              View all
            </Link>
          </header>

          {recentListings.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <Building2 className="size-7 text-stone" aria-hidden="true" />
              <p className="mt-3 font-medium text-ink">
                You haven&apos;t listed a studio yet
              </p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-stone">
                Turn your space into an opportunity and start welcoming
                creators.
              </p>
              <Link
                href="/add-studio"
                className={buttonStyles({
                  size: "sm",
                  className: "mt-4",
                })}
              >
                Add a Studio
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-line/60">
              {recentListings.map((studio) => (
                <Link
                  key={studio._id}
                  href={`/studios/${studio._id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ivory/60"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                    <SmartImage
                      src={studio.imageUrl}
                      alt={studio.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {studio.title}
                    </p>
                    <p className="mt-1 text-xs text-stone">
                      {studio.category} · {formatCurrency(studio.hourlyRate)}/hr
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-stone"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg tracking-[-0.02em]">
          Quick actions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:border-ink/30 hover:shadow-[0_18px_40px_-30px_rgba(23,21,18,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <action.icon className="size-4.5" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="size-4 text-stone transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-sm font-medium text-ink">
                {action.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-stone">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
      <Suspense
        fallback={
          <>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-4 h-12 w-full max-w-xl" />
            <div className="mt-8">
              <StatRowSkeleton count={4} />
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-line bg-paper p-5">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-3 rounded-2xl border border-line bg-paper p-5">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
