"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  X,
} from "lucide-react";
import "swiper/css";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

export function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === 0 ? images.length - 1 : current - 1,
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => (current + 1) % images.length);
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [lightboxOpen, images.length]);

  function goToSlide(index: number) {
    setActiveIndex(index);
    mainSwiper?.slideTo(index);
  }

  function openLightbox() {
    setLightboxIndex(activeIndex);
    setLightboxOpen(true);
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line/60 bg-sand">
        <Swiper
          modules={[A11y, Keyboard]}
          onSwiper={setMainSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          spaceBetween={0}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          className="aspect-[16/10] w-full sm:aspect-[16/9]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div className="relative h-full w-full">
                <SmartImage
                  src={image}
                  alt={`${title} — photo ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 72vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
          <span className="rounded-full bg-ink/70 px-3 py-1.5 text-[11px] font-medium tracking-wide text-ivory backdrop-blur">
            Photo {activeIndex + 1} / {images.length}
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-[11px] text-ivory/80 backdrop-blur sm:flex">
            <Images className="size-3.5" aria-hidden="true" />
            Studio gallery
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => mainSwiper?.slidePrev()}
              aria-label="Previous photo"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-ink/50 text-ivory backdrop-blur transition-colors hover:bg-ink/80"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => mainSwiper?.slideNext()}
              aria-label="Next photo"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-ink/50 text-ivory backdrop-blur transition-colors hover:bg-ink/80"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={openLightbox}
            className="flex items-center gap-2 rounded-full border border-white/40 bg-paper/90 px-4 py-2.5 text-xs font-medium text-ink backdrop-blur transition-colors hover:bg-paper"
          >
            <Expand className="size-3.5" aria-hidden="true" />
            Show all {images.length} photos
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2.5">
        {images.map((image, index) => (
          <button
            key={`thumb-${image}-${index}`}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`View photo ${index + 1}`}
            aria-current={activeIndex === index}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all duration-300",
              activeIndex === index
                ? "border-accent opacity-100"
                : "border-transparent opacity-55 hover:opacity-90",
            )}
          >
            <SmartImage
              src={image}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[85] overflow-y-auto bg-dark/95 p-4 text-ivory backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
        >
            <div className="mx-auto flex min-h-full max-w-6xl flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-ivory/70">
                    Photo {lightboxIndex + 1} of {images.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close gallery"
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 text-ivory transition-colors hover:bg-white/10"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="relative mt-5 min-h-[50vh] flex-1 overflow-hidden rounded-2xl bg-black/40">
                <SmartImage
                  key={images[lightboxIndex]}
                  src={images[lightboxIndex]}
                  alt={`${title} — photo ${lightboxIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((current) =>
                      current === 0 ? images.length - 1 : current - 1,
                    )
                  }
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-dark/60 text-ivory backdrop-blur transition-colors hover:bg-dark"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((current) => (current + 1) % images.length)
                  }
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-dark/60 text-ivory backdrop-blur transition-colors hover:bg-dark"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((image, index) => (
                  <button
                    key={`lightbox-thumb-${image}-${index}`}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`View photo ${index + 1}`}
                    aria-current={index === lightboxIndex}
                    className={cn(
                      "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                      index === lightboxIndex
                        ? "border-accent opacity-100"
                        : "border-transparent opacity-55 hover:opacity-90",
                    )}
                  >
                    <SmartImage
                      src={image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
        </div>
      ) : null}
    </div>
  );
}
