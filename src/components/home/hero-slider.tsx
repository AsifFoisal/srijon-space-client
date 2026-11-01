"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
} from "swiper/modules";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import { buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

type HeroCta =
  | { label: string; href: string }
  | { label: string; scrollTo: string };

interface HeroSlide {
  image: string;
  kicker: string;
  title: string;
  description: string;
  primary: HeroCta;
  secondary: HeroCta;
}

const slides: HeroSlide[] = [
  {
    image: "/images/hero/hero-1.jpg",
    kicker: "Creative studio marketplace",
    title: "Your Next Great Creation Starts Here.",
    description:
      "Discover inspiring studios and professional creative spaces designed to bring your vision to life.",
    primary: { label: "Explore Studios", href: "/studios" },
    secondary: { label: "Host Your Space", href: "/add-studio" },
  },
  {
    image: "/images/hero/hero-2.jpg",
    kicker: "Made for every discipline",
    title: "The Perfect Space for Every Creative Vision.",
    description:
      "From professional photography studios to cinematic sound stages, find the environment your next project deserves.",
    primary: { label: "Explore Studios", href: "/studios" },
    secondary: { label: "Browse Categories", scrollTo: "categories" },
  },
  {
    image: "/images/hero/hero-3.jpg",
    kicker: "For studio owners",
    title: "Own a Studio? Let Creators Discover It.",
    description:
      "List your creative space, connect with talented creators, and make your studio part of something bigger.",
    primary: { label: "Host Your Space", href: "/add-studio" },
    secondary: { label: "Explore Studios", href: "/studios" },
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [studioCount, setStudioCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`)
      .then((response) => response.json())
      .then((data) => {
        if (active) setStudioCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => {
        if (active) setStudioCount(0);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-dark"
      aria-label="Featured creative spaces"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => {
          const primaryHref =
            "href" in slide.primary ? slide.primary.href : null;
          const secondaryHref =
            "href" in slide.secondary ? slide.secondary.href : null;
          const secondaryScroll =
            "scrollTo" in slide.secondary ? slide.secondary.scrollTo : null;
          const HeadingTag = index === 0 ? "h1" : "h2";

          return (
          <SwiperSlide key={slide.title}>
            <div className="relative h-full w-full">
              <SmartImage
                src={slide.image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-dark/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/25" />

              <div className="relative z-10 flex h-full items-center justify-center text-center">
                <div className="shell shell-wide mx-auto w-full pt-24 pb-16">
                  <div className="mx-auto max-w-3xl">
                    <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-on-dark/60">
                      <span className="h-px w-10 bg-accent" aria-hidden="true" />
                      {slide.kicker}
                    </p>
                    <HeadingTag className="mt-6 text-balance font-display text-[clamp(2.9rem,6.5vw,6.1rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white">
                      {slide.title}
                    </HeadingTag>
                    <p className="mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-7 text-on-dark/70 sm:text-base">
                      {slide.description}
                    </p>

                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                      {primaryHref ? (
                        <Link
                          href={primaryHref}
                          className={buttonStyles({ size: "lg" })}
                        >
                          {slide.primary.label}
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                      ) : null}

                      {secondaryHref ? (
                        <Link
                          href={secondaryHref}
                          className={buttonStyles({
                            variant: "light",
                            size: "lg",
                          })}
                        >
                          {slide.secondary.label}
                        </Link>
                      ) : secondaryScroll ? (
                        <a
                          href={`#${secondaryScroll}`}
                          className={buttonStyles({
                            variant: "light",
                            size: "lg",
                          })}
                        >
                          {slide.secondary.label}
                          <ArrowDownRight
                            className="size-4"
                            aria-hidden="true"
                          />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="shell shell-wide">
          <div className="pointer-events-auto flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <p className="font-display text-sm tracking-[0.12em] text-on-dark/70">
                <span className="text-white">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-on-dark/30">/</span>
                {String(slides.length).padStart(2, "0")}
              </p>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {slides.map((slide, index) => (
                  <span
                    key={slide.title}
                    className={cn(
                      "h-px transition-all duration-500",
                      activeIndex === index
                        ? "w-10 bg-accent"
                        : "w-5 bg-white/25",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-on-dark/50 lg:flex">
              {studioCount === null ? (
                <Skeleton className="h-3 w-32 bg-white/10" />
              ) : (
                <span>{studioCount} curated spaces</span>
              )}
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <span>5 creative categories</span>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <span>4.8 average rating</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous slide"
                className="flex size-11 items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-white/60 hover:bg-white/10"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next slide"
                className="flex size-11 items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-white/60 hover:bg-white/10"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
