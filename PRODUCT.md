# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally (confirmed):

- **Creators** — photographers, filmmakers, podcasters, musicians, content creators, artists — who discover and book creative studios by the hour.
- **Studio owners** — who list their spaces, manage listings, and handle incoming bookings.

## Product Purpose

Srijon Space is a peer-to-peer marketplace for creative studio rentals: photo studios, film & sound stages, podcast rooms, music suites, and art workshops. Creators find an inspiring space and book it by the hour; owners fill their calendar. Success for the current phase is a complete, polished Programming Hero Milestone 8 submission: every existing feature working (auth, booking, listing CRUD) with a UI that holds up to evaluation.

## Positioning

A creator-focused studio marketplace: curated creative spaces (cyc walls, live rooms, acoustically treated lounges) bookable by the hour with transparent pricing (hourly rate + security deposit) — not generic venue or meeting-room rental.

## Operating Context

- Programming Hero **Milestone 8 assignment**. Evaluated on feature completeness plus polish; the standard PH brief applies and all built features must keep working.
- `studio-space-client/` is the only implemented app and git repo; the backend is a separate server reached via `NEXT_PUBLIC_API_URL` (`.env`), with better-auth on MongoDB (email + Google OAuth) via `NEXT_PUBLIC_APP_URL`.
- Dev: `npm run dev` at http://localhost:3000 (Next.js 16, Turbopack, `cacheComponents` enabled — uncached async data outside `<Suspense>` fails the build).

## Capabilities and Constraints

Confirmed functionality:

- Explore studios: filter by category, sort (Recommended / Newest / Price / Rating), paginated grid.
- Studio details: gallery, amenities, reviews, owner info, booking modal (date, start/end time, attendees, project description, price breakdown with security deposit).
- Auth: email + Google sign-in; protected routes via middleware proxy (`/dashboard`, `/add-studio`, `/my-bookings`, `/my-listings`, `/studios/edit/*`).
- Owner side: add/edit studio listing (validated form), dashboard, my-listings, my-bookings (status lifecycle: Pending → Confirmed/Cancelled → Completed).
- Static surfaces: home (hero slider, featured, categories, how-it-works, trust, host CTA), about, policies, 404.

Constraints:

- Next.js 16.4.3 App Router: `params`/`searchParams` are async; use generated `PageProps` types; shadcn tokens come from `src/app/globals.css` `@theme inline` (Tailwind v4 CSS-first, no config file).
- Booking time slots run 07:00–23:00 in 30-minute steps.

Open (deliberately undecided): none recorded.

## Brand Commitments

- Name: **Srijon Space** (logo component + wordmark in nav/footer/preloader).
- Support contact: `hello@srijonspace.com`.
- Voice in existing copy: confident, maker-to-maker, concrete ("Cyc walls, seamless backdrops, and daylight-filled lofts").

## Evidence on Hand

- Real API data for studios (fetched via `NEXT_PUBLIC_API_URL`); featured studios on home.
- Seed/fixture content: category copy and images in `src/lib/constants.ts`, reviewer data in `src/data/reviews.ts` (mock reviews — do not present as real testimonials beyond the assignment context).
- No testimonials, press, or customer logos beyond what the assignment context provides.

## Product Principles

1. **The space is the product.** Every screen lets real studio content — images, rates, capacity, amenities — carry the persuasion; chrome stays quiet around it.
2. **Booking confidence.** Price, time, and status must never be ambiguous: creators commit money and time, owners commit their calendar.
3. **Two-sided fairness.** Owners get the same craft as creators: listing and management flows are first-class, not an admin afterthought.
4. **Polish is graded.** This is evaluated work; precision in spacing, type, and states is a feature, not a garnish.

## Accessibility & Inclusion

Baseline enforced in code: visible `:focus-visible` rings (2px accent, 3px offset), `prefers-reduced-motion` honored, `color-scheme` set for date/time/select inputs. No product-specific accessibility requirement established beyond WCAG-minded defaults.
