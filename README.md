# Srijon Space — Creative studios, ready to book

**Live site:** https://srijon-space-client.vercel.app

Srijon Space is a peer-to-peer marketplace for creative studio rentals — photo studios, film stages, podcast lounges, music suites, and art workshops. Creators browse and book spaces by the hour; hosts list and manage their own studios with full control over incoming bookings.

## ✨ Features

- **Instant booking system** — pick a date, start/end time (12-hour), and attendees; every request is saved with a `Pending` status, and double-booked slots are rejected server-side (overlap check against Pending/Confirmed bookings returns **409** with a clear message).
- **Host booking management** — hosts see every request for their studios on the dashboard and can move bookings through **Pending → Confirmed → Completed / Cancelled** via a status dropdown; past sessions auto-complete themselves.
- **Real ratings & reviews** — signed-in users rate 1–5 stars once per studio (re-rating updates); scores are aggregated live with a MongoDB `$lookup` pipeline, so cards, detail pages, and the "Highest Rated" sort all reflect real data.
- **Full studio CRUD with imgbb image hosting** — add, update, and delete listings through a multi-step form; images upload to imgbb (or paste URLs) and list data lives in MongoDB.
- **JWT-secured private area** — sessions live in HTTPOnly cookies, a better-auth JWT is minted per user, and every backend mutation rejects unauthenticated calls with **401 Unauthorized**.
- **Explore page with instant filtering** — search across title/category/address/amenities, category chips, five sort orders (including Highest Rated for real ratings), and pagination — all rendered from a server-fetched dataset.
- **Login & registration** — email/password with live password validation (uppercase, lowercase, 6+ chars), plus **Continue with Google**; pages are guarded by middleware and redirect back to where you were headed.
- **Polish everywhere** — branded intro animation (plays once per visit), skeleton loaders, friendly empty states, a custom 404, light/dark theme toggle, toasts on every action, and full mobile → desktop responsiveness.

## 🧰 Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | Next.js 16 (App Router, Cache Components / Partial Prerendering), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first tokens), shadcn-style components on Base UI, Lucide icons, Swiper |
| Auth | better-auth (email/password + Google social login, HTTPOnly cookies) with the better-auth JWT plugin |
| Backend | Express.js (Node) REST API with JWT verification (jose + remote JWKS) |
| Database | MongoDB (studios, bookings, reviews, users) |
| Misc | imgbb image upload API, Sonner toasts, react-hook-form, date-fns |

## 🚀 Local Setup

### Prerequisites
- Node.js 20+ and npm
- A MongoDB database (Atlas or local) with a replica set
- An [imgbb](https://api.imgbb.com) API key
- Google OAuth client ID/secret (for social login)

### 1. Database server (optional — to run your own)
```bash
cd studio-space-server
npm install
# create .env with:
#   MONGODB_URI=your-mongodb-connection-string
#   NEXT_PUBLIC_AUTH_URL=http://localhost:3000
#   NEXT_PUBLIC_API_URL=http://localhost:8000
node index.js          # REST API on http://localhost:8000
```

### 2. Client
```bash
cd studio-space-client
npm install
# create .env with:
#   NEXT_PUBLIC_API_URL=http://localhost:8000
#   NEXT_PUBLIC_APP_URL=http://localhost:3000
#   BETTER_AUTH_URL=http://localhost:3000
#   BETTER_AUTH_SECRET=any-long-random-string
#   GOOGLE_CLIENT_ID=...  GOOGLE_CLIENT_SECRET=...
#   NEXT_PUBLIC_IMGBB_API_KEY=...
npx next typegen       # generates route types (Next 16)
npm run dev            # http://localhost:3000
```

### 3. Seed demo data (optional)
```bash
cd studio-space-server
node seed.js --force   # 11 studios, 27 reviews, 8 bookings (images uploaded to imgbb)
```

## 🔑 Examiner Test Credentials

```
Email:    demo@srijonspace.com
Password: Demo@1234
```

This account owns all seeded studios and bookings, so the dashboard, My Studio Listings, My Bookings, and host booking management are fully populated. You can also register your own account or use **Continue with Google** — booking and reviewing work with any account.

## 🗺️ Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero slider, featured studios, categories, how it works |
| `/studios` | Public | Explore all studios with search, filters, sort, pagination |
| `/studios/[id]` | Public | Gallery, specifications, amenities, host, reviews, booking |
| `/login`, `/register` | Public | Authentication |
| `/add-studio` | Private | Create a listing (imgbb upload) |
| `/my-listings` | Private | Update/delete your studios (confirm modal) |
| `/studios/edit/[id]` | Private (owner) | Pre-filled update form |
| `/my-bookings` | Private | Your reservations with status badges + cancel |
| `/dashboard` | Private | Stats, recent activity, host booking management |

## 🧠 Challenges Implemented

1. **JWT security with HTTPOnly cookies** — sessions are HTTPOnly-cookie backed; a JWT is minted from the session and verified server-side; unauthorized mutations get 401.
2. **Booking double-booking prevention** — overlapping Pending/Confirmed bookings for the same studio, date, and time window are rejected with 409 before insert.
3. **Theme customization** — full-system light/dark toggle, persisted across reloads.
4. *(Bonus)* **Auto-completion** — bookings whose session time has passed automatically become `Completed`.

---

© 2026 Srijon Space. Built with Next.js on Vercel.
