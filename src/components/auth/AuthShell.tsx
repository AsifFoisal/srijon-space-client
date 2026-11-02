import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SmartImage } from "@/components/ui/smart-image";

export function AuthShell({
  children,
  image,
  imageAlt,
  kicker,
  quote,
  caption,
}: {
  children: React.ReactNode;
  image: string;
  imageAlt: string;
  kicker: string;
  quote: string;
  caption: string;
}) {
  return (
    <div>
      <div className="grid min-h-dvh lg:grid-cols-2">
        <div className="flex flex-col px-5 pb-10 pt-8 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <Link
              href="/"
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
            >
              Back to home
            </Link>
          </div>

          <div className="flex flex-1 items-center py-10">
            <div className="mx-auto w-full max-w-md">{children}</div>
          </div>

          <p className="text-center text-[11px] text-stone">
            © 2026 Srijon Space. All rights reserved.
          </p>
        </div>

        <div className="relative hidden overflow-hidden bg-dark lg:block">
          <SmartImage
            src={image}
            alt={imageAlt}
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/35 to-dark/10" />

          <span className="absolute right-8 top-8 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-on-dark/80 backdrop-blur">
            12 curated spaces · New York
          </span>

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
            <p className="kicker kicker-light">{kicker}</p>
            <blockquote className="mt-4 max-w-lg text-balance font-display text-3xl leading-[1.15] tracking-[-0.03em] text-white xl:text-4xl">
              “{quote}”
            </blockquote>
            <p className="mt-4 text-xs text-on-dark/45">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
