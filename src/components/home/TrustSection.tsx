"use client";

import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const assurances: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "A commitment to providing a safer and more reliable rental experience.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    description:
      "Help creators and hosts connect through transparent profile information.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    description:
      "Encourage responsible use of professional equipment and studio facilities.",
  },
  {
    icon: Headphones,
    title: "24/7 Host Support",
    description:
      "Make assistance accessible throughout the booking journey.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="shell shell-wide">
        <div>
          <SectionHeading
            kicker="Host guarantee & creator support"
            title="Create With Confidence"
            description="A better creative experience starts with trust, safety, and reliable support."
          />
        </div>

        <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map((item, index) => (
            <div key={item.title}>
              <div className="group border-t border-ink/15 py-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-xs text-stone/60">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
