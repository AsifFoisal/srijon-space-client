"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle({ light = false }: { light?: boolean }) {
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // The theme still switches for this visit if storage is unavailable.
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      onClick={toggleTheme}
      className={cn(
        "rounded-full border border-line bg-paper text-ink hover:border-ink/30 hover:bg-sand",
        light &&
          "border-white/20 bg-white/10 text-on-dark hover:border-white/40 hover:bg-white/20",
      )}
    >
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </Button>
  );
}
