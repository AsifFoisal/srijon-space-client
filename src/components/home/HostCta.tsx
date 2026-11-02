"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { buttonStyles } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";

const hostPoints = [
  "Keep control of your calendar and pricing.",
  "Reach creators actively looking for your kind of space.",
  "Every booking includes liability protection and support.",
];

export function HostCta() {
  return (
    <section className="relative overflow-hidden bg-dark">
      <div className="relative py-20 lg:py-28">
        <SmartImage
          src="/images/about/host-cta.jpg"
          alt="A professional photo studio prepared for a shoot"
          fill
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-dark/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/20" />

        <div className="shell shell-wide relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div>
                <p className="kicker kicker-light">For studio owners</p>
                <h2 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.05em] text-white">
                  Your Studio Has a Story. Let Creators Be Part of It.
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-7 text-on-dark/65">
                  Turn your creative space into an opportunity. Showcase your
                  studio and connect with people who need a place to create.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/add-studio"
                    className={buttonStyles({ size: "lg" })}
                  >
                    Become a Host
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className={buttonStyles({ variant: "light", size: "lg" })}
                  >
                    Talk to our team
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md sm:p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-on-dark/50">
                  Why hosts choose Srijon Space
                </p>
                <ul className="mt-5 space-y-4">
                  {hostPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-6 text-on-dark/75"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="font-display text-3xl text-white">4.9</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-on-dark/40">
                      Avg host rating
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-3xl text-white">12</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-on-dark/40">
                      Active spaces
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
