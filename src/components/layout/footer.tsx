"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { SUPPORT_EMAIL } from "@/lib/constants";

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A6 6 0 0 1 16 8Z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Explore Studios", href: "/studios" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "For Hosts",
    links: [
      { label: "Become a Host", href: "/add-studio" },
      { label: "Add New Studio", href: "/add-studio" },
      { label: "My Studio Listings", href: "/my-listings" },
    ],
  },
  {
    title: "Studio Categories",
    links: [
      {
        label: "Photo Studios",
        href: `/studios?category=${encodeURIComponent("Photo Studio")}`,
      },
      {
        label: "Film Stages",
        href: `/studios?category=${encodeURIComponent("Film Stage")}`,
      },
      {
        label: "Podcast Rooms",
        href: `/studios?category=${encodeURIComponent("Podcast Lounge")}`,
      },
      {
        label: "Music Suites",
        href: `/studios?category=${encodeURIComponent("Music Suite")}`,
      },
      {
        label: "Art Workshops",
        href: `/studios?category=${encodeURIComponent("Art Workshop")}`,
      },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
      { label: "Help Center", href: "/policies#help" },
      { label: "Terms & Conditions", href: "/policies#terms" },
      { label: "Privacy Policy", href: "/policies#privacy" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogo },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInLogo },
];

export function Footer() {
  return (
    <footer className="grain bg-dark text-on-dark">
      <div className="shell shell-wide relative z-10 py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1.6fr] lg:gap-20">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-on-dark/60">
              Connecting creative minds with inspiring spaces. Find your next
              studio, bring your vision to life, and create without limits.
            </p>

            <div className="mt-8 flex items-center gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-on-dark/70 transition-colors hover:border-accent hover:bg-accent hover:text-white"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-on-dark/70 transition-colors hover:border-accent hover:bg-accent hover:text-white"
              >
                <XLogo className="size-3.5" />
              </a>
            </div>

            <p className="mt-10 font-display text-[13px] uppercase tracking-[0.22em] text-on-dark/30">
              New York · Est. 2021
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-on-dark/40">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-on-dark/65 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-white/10 pt-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="kicker kicker-light">Newsletter</p>
            <h3 className="mt-3 font-display text-2xl tracking-[-0.03em]">
              Studio openings, straight to your inbox.
            </h3>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-on-dark/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <p>Photography via Unsplash &amp; Pexels.</p>
        </div>
      </div>
    </footer>
  );
}
