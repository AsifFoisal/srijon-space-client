"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";
import { usePathname } from "next/navigation";
import type { TextLoaderProps } from "@/components/ui/text-loader";

const PANEL_BACKGROUND = "#121110";

/**
 * Loads the animated preloader in the browser only. Rendering the dark panel
 * first means the page never flashes before the animation starts.
 */
export function AppPreloader() {
  const pathname = usePathname();
  // Only a document load on Home gets the intro. Arriving from another page,
  // or reloading any other route, starts with the loader already finished.
  const [done, setDone] = useState(pathname !== "/");
  const [Loader, setLoader] = useState<ComponentType<TextLoaderProps> | null>(
    null,
  );
  const showLoader = !done && pathname === "/";

  useEffect(() => {
    if (!showLoader) return;

    let active = true;

    import("@/components/ui/text-loader")
      .then((module) => {
        if (active) setLoader(() => module.TextLoader);
      })
      .catch(() => {
        // If the animation cannot load, never leave the page covered.
        if (active) setDone(true);
      });

    return () => {
      active = false;
    };
  }, [showLoader]);

  // Hide the page scrollbar while the intro covers the screen.
  useEffect(() => {
    if (!showLoader) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [showLoader]);

  if (!showLoader) return null;

  if (!Loader) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[100]"
        style={{ backgroundColor: PANEL_BACKGROUND }}
      />
    );
  }

  return (
    <Loader
      text="Srijon Space"
      accentText="Space"
      accentColor="#e8491d"
      ghostColor="rgba(247, 243, 235, 0.35)"
      fontFamily="var(--font-grotesk)"
      fontWeight={600}
      backgroundColor={PANEL_BACKGROUND}
      fullscreen
      onComplete={() => setDone(true)}
    />
  );
}
