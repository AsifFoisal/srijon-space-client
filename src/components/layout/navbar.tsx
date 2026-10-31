"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/layout/logo";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works", anchor: true },
  { label: "About Us", href: "/about" },
];

const privateLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarCheck },
];

function isActiveLink(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isReady, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";
  const onDark = isHome && !scrolled;

  async function handleMobileLogout() {
    setMobileOpen(false);
    await logout();
    toast.success("You're signed out. See you soon.");
    router.push("/");
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          onDark
            ? "bg-transparent"
            : "border-b border-line/70 bg-ivory/85 backdrop-blur-xl",
        )}
      >
        <div className="shell shell-wide flex h-[76px] items-center justify-between gap-6">
          <Logo light={onDark} />

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary navigation"
          >
            {links.map((link) => {
              const active = isActiveLink(link.href, pathname);
              const className = cn(
                "relative py-2 text-[13px] font-medium tracking-[0.01em] transition-colors",
                onDark
                  ? active
                    ? "text-white"
                    : "text-ivory/65 hover:text-white"
                  : active
                    ? "text-ink"
                    : "text-stone hover:text-ink",
              );

              if (link.anchor) {
                return (
                  <a key={link.href} href={link.href} className={className}>
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300",
                      active ? "w-full" : "w-0",
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {!isReady ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            ) : user ? (
              <ProfileDropdown light={onDark} />
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className={buttonStyles({
                    variant: "ghost",
                    size: "sm",
                    className: onDark ? "text-ivory hover:bg-white/10" : "",
                  })}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={buttonStyles({
                    size: "sm",
                    variant: onDark ? "dark" : "primary",
                  })}
                >
                  Get started
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={cn(
                "flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden",
                onDark
                  ? "border-white/20 bg-white/10 text-ivory hover:bg-white/20"
                  : "border-line bg-paper text-ink hover:border-ink/30",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] cursor-default bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col overflow-y-auto bg-ivory shadow-2xl lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
              <Logo onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink/30"
                aria-label="Close menu"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 px-5 py-8" aria-label="Mobile primary">
              <ul className="space-y-1">
                {links.map((link, index) => {
                  const active = isActiveLink(link.href, pathname);
                  const className = cn(
                    "flex items-center justify-between border-b border-line/60 py-4 font-display text-2xl tracking-[-0.03em] transition-colors",
                    active ? "text-accent" : "text-ink hover:text-accent",
                  );
                  const content = (
                    <>
                      {link.label}
                      <span className="text-[10px] font-medium tracking-[0.2em] text-stone">
                        0{index + 1}
                      </span>
                    </>
                  );

                  return (
                    <li key={link.href}>
                      {link.anchor ? (
                        <a
                          href={link.href}
                          className={className}
                          onClick={() => setMobileOpen(false)}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className={className}
                          onClick={() => setMobileOpen(false)}
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                {!isReady ? (
                  <Skeleton className="h-24 w-full rounded-2xl" />
                ) : user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
                      <Avatar src={user.avatar} name={user.name} size={44} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-stone">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {privateLinks.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-ink transition-colors hover:bg-sand/70"
                          >
                            <item.icon
                              className="size-4 text-stone"
                              aria-hidden="true"
                            />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={handleMobileLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-accent-deep transition-colors hover:bg-accent-soft"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className={buttonStyles({
                        variant: "outline",
                        className: "w-full",
                      })}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className={buttonStyles({ className: "w-full" })}
                    >
                      Create an account
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            <div className="border-t border-line/70 px-5 py-5">
              <p className="text-xs leading-5 text-stone">
                Connecting creative minds with inspiring spaces.
              </p>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
