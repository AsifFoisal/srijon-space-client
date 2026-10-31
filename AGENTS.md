# AGENTS.md

## Workspace layout
- `studio-space-client/` is the only implemented app and the only git repo. Run git commands there; this parent folder has no `.git`.
- `studio-space-server/` is an empty placeholder. No backend, API, database, or tests exist yet; don't assume endpoints or server scripts.
- There is no root `package.json`. Run npm commands from `studio-space-client/`, and use npm: only `package-lock.json` exists (the README's pnpm/yarn/bun commands are generic).

## Commands (from `studio-space-client/`)
- `npm run dev`: dev server at http://localhost:3000. Turbopack is the default in Next 16.
- `npm run lint`: ESLint 9 flat config. `next lint` was removed in Next 16.
- `npm run build`: production build; runs TypeScript and Cache Components validation.
- `npx next typegen` then `npx tsc --noEmit`: standalone typecheck. Run typegen first on a clean checkout; `PageProps`/`LayoutProps` come from generated `.next/types`.
- No test framework or test script is configured.

## Next.js 16 constraints
- Installed Next is 16.4.3, with breaking changes from earlier versions. Read the version-matched guides in `studio-space-client/node_modules/next/dist/docs/` before writing App Router code. The managed block in `studio-space-client/AGENTS.md` requires this; keep it because `next dev` re-adds it.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`. Uncached async data or request-time APIs (`fetch`, `cookies()`, `headers()`, `searchParams`, dynamic `params`) outside `<Suspense>` fail the build with a blocking-route error. Fix with `<Suspense>` or `"use cache"` + `cacheLife`; use `next build --debug-prerender` to report all failing routes.
- Tailwind is compiled by the `@tailwindcss/turbopack` loader in `next.config.ts`; there is no PostCSS or Tailwind config. Stay on Turbopack (the default); `--webpack` will not apply this loader.
- `params` and `searchParams` are async. Await them and use the generated `PageProps`/`LayoutProps` types instead of hand-written prop types.
- `src/app/globals.css` imports `shadcn/tailwind.css`, so the `shadcn` package is required at build time. Don't remove it just because it looks like a CLI-only package.

## UI conventions
- shadcn style is `base-nova` using Base UI (`@base-ui/react`), not Radix. Add components with `npx shadcn add <component>`; they land in `src/components/ui/`.
- Base UI composition uses the `render` prop; there is no `asChild` prop.
- `cn()` comes from the `cn` package, re-exported by `@/lib/utils`; generated components sometimes import `cn` directly. Don't add `clsx` or `tailwind-merge`.
- Tailwind v4 is CSS-first: design tokens live in `src/app/globals.css` under `@theme inline`; there is no `tailwind.config.*`. The alias `@/*` maps to `src/*`.
