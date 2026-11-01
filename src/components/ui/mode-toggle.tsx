"use client";

import { useEffect, useState } from "react";

export function ModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync the switch with the theme the pre-hydration script already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function handleToggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // The theme still switches for this visit if storage is unavailable.
    }
  }

  return (
    <span className="theme-switch-wrap">
      <label className="theme-switch" aria-label="Toggle light and dark mode">
        <input type="checkbox" checked={isDark} onChange={handleToggle} />
        <div className="switch-bg">
          <div className="sky-stars">
            <div className="star star-1" />
            <div className="star star-2" />
            <div className="star star-3" />
            <div className="star star-4" />
          </div>
          <div className="sky-clouds">
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
          </div>
          <div className="sky-vault">
            <div className="sun" />
            <div className="moon">
              <div className="craters">
                <div className="crater crater-1" />
                <div className="crater crater-2" />
                <div className="crater crater-3" />
              </div>
            </div>
          </div>
          <div className="landscape">
            <div className="mountain mountain-1" />
            <div className="mountain mountain-2" />
            <div className="terrain" />
            <div className="tree tree-1" />
            <div className="tree tree-2" />
            <div className="tree tree-3" />
          </div>
        </div>
      </label>
    </span>
  );
}
