"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// A preloader. The letters rise one by one out of a mask, the accent letters fill with a solid
// brand colour, they leave through the top, and then the whole panel lifts off the page. It uses
// the font of the page it sits in, so there is no font to install.

export type TextLoaderProps = {
  /** The word the loader spells out. One letter is one animated piece. */
  text?: string;
  /** The part of the text that fills with the accent colour. Defaults to all of it. */
  accentText?: string;
  /** Solid colour used for the accent part of the word. */
  accentColor?: string;
  /** Colour of the panel. */
  backgroundColor?: string;
  /** Colour of the letters before the accent colour fills them. Leave it out and it follows the panel. */
  ghostColor?: string;
  /** Font family for the loader text. Defaults to the page font. */
  fontFamily?: string;
  /** Font weight for the loader text. */
  fontWeight?: number;
  /** How long each step takes, in seconds. Any you leave out keep their default. */
  duration?: {
    /** Letters rising into view. */
    slideUp?: number;
    /** The accent colour filling the letters. */
    reveal?: number;
    /** Letters leaving through the top. */
    slideDown?: number;
  };
  /** The pauses in between, in seconds. Any you leave out keep their default. */
  delays?: {
    /** Gap between one letter and the next. */
    stagger?: number;
    /** Pause between the letters landing and the accent fill starting. */
    betweenAnimations?: number;
    /** Pause between the accent fill finishing and the letters leaving. */
    beforeSlideDown?: number;
  };
  /** Cover the whole window (position: fixed) instead of filling the box it sits in. */
  fullscreen?: boolean;
  /** Change this number to play the loader again. */
  replayKey?: number;
  /** Called once the panel has left the screen. */
  onComplete?: () => void;
  /** Extra classes for the panel. */
  className?: string;
};

const DEFAULT_ACCENT = "#e8491d";
const DEFAULT_DURATION = { slideUp: 0.6, reveal: 0.8, slideDown: 0.6 };
const DEFAULT_DELAYS = {
  stagger: 0.05,
  betweenAnimations: 0.3,
  beforeSlideDown: 0.5,
};

function withDefaults<T extends Record<string, number>>(
  defaults: T,
  given: Partial<T> = {},
): T {
  const merged = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = given[key];
    if (value !== undefined) merged[key] = value;
  }
  return merged;
}

// Picks ghost letters from the panel colour, so a light panel never hides them.
function ghostFor(background: string): string {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background.trim())?.[1];
  if (!hex) return "rgba(255, 255, 255, 0.2)";
  const full = hex.length === 3 ? Array.from(hex, (c) => c + c).join("") : hex;
  const channel = (i: number) => parseInt(full.slice(i, i + 2), 16);
  const [r, g, b] = [channel(0), channel(2), channel(4)];
  const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  return light ? "rgba(0, 0, 0, 0.14)" : "rgba(255, 255, 255, 0.2)";
}

export function TextLoader({
  text = "DIMAAC",
  accentText,
  accentColor = DEFAULT_ACCENT,
  backgroundColor = "#121110",
  ghostColor,
  fontFamily,
  fontWeight = 700,
  duration,
  delays,
  fullscreen = false,
  replayKey = 0,
  onComplete,
  className = "",
}: TextLoaderProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const { slideUp, reveal, slideDown } = withDefaults(
    DEFAULT_DURATION,
    duration,
  );
  const { stagger, betweenAnimations, beforeSlideDown } = withDefaults(
    DEFAULT_DELAYS,
    delays,
  );

  // The newest onComplete lives in a ref, so a parent re-render never restarts the loader.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const letters = Array.from(text);
  const accentStart = accentText
    ? Math.max(0, text.indexOf(accentText))
    : 0;
  const accentLength = accentText
    ? Math.min(accentText.length, letters.length - accentStart)
    : letters.length;

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const glyphs = gsap.utils.toArray<HTMLElement>("[data-glyph]", panel);
      const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", panel);
      const finish = () => {
        gsap.set(panel, { visibility: "hidden" });
        onCompleteRef.current?.();
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(panel, { y: 0, yPercent: 0, visibility: "visible" });
        gsap.set(glyphs, { y: 0, yPercent: 110 });
        gsap.set(fills, { clipPath: "inset(100% 0% 0% 0%)" });

        const tl = gsap.timeline({ onComplete: finish });
        tl.to(glyphs, {
          yPercent: 0,
          duration: slideUp,
          stagger,
          ease: "power2.out",
        })
          .to(fills, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: reveal,
            delay: betweenAnimations,
            ease: "power1.inOut",
          })
          .to(glyphs, {
            yPercent: -110,
            duration: slideDown,
            stagger,
            delay: beforeSlideDown,
            ease: "power2.in",
          })
          .to(
            panel,
            {
              yPercent: -100,
              duration: 0.8,
              delay: 0.3,
              ease: "power2.inOut",
            },
            "-=0.2",
          );
      });

      // Reduced motion: nothing moves. The word fades away after a short pause.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(panel, { y: 0, yPercent: 0, visibility: "visible", opacity: 1 });
        gsap.set(glyphs, { y: 0, yPercent: 0 });
        gsap.set(fills, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.to(panel, {
          opacity: 0,
          duration: 0.4,
          delay: 0.9,
          ease: "none",
          onComplete: finish,
        });
      });

      return () => mm.revert();
    },
    {
      scope: panelRef,
      dependencies: [
        text,
        slideUp,
        reveal,
        slideDown,
        stagger,
        betweenAnimations,
        beforeSlideDown,
        replayKey,
      ],
      revertOnUpdate: true,
    },
  );

  const fontSize = `clamp(2rem, min(20cqi, ${(88 / (Math.max(letters.length, 3) * 0.66)).toFixed(2)}cqi), 8rem)`;

  return (
    <div
      ref={panelRef}
      role="status"
      className={`${fullscreen ? "fixed" : "absolute"} inset-0 z-[100] flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor, containerType: "inline-size" }}
    >
      <span className="sr-only">{text}</span>
      <div
        aria-hidden="true"
        className="flex overflow-hidden px-[0.04em]"
        style={{
          fontSize,
          fontFamily,
          fontWeight,
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
        }}
      >
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            data-glyph
            className="relative inline-block whitespace-pre"
            style={{
              color: ghostColor ?? ghostFor(backgroundColor),
              transform: "translateY(110%)",
            }}
          >
            {letter}
            {index >= accentStart && index < accentStart + accentLength ? (
              <span
                data-fill
                className="absolute inset-0"
                style={{
                  color: accentColor,
                  clipPath: "inset(100% 0% 0% 0%)",
                }}
              >
                {letter}
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
