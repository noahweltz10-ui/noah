"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shiftculture_dashboard_theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring browser-only state after hydration, deliberately not on first render
        setTheme(stored);
        document.documentElement.dataset.dashboardTheme = stored;
      }
    } catch {
      // localStorage unavailable — default theme stands
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.dashboardTheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // per-viewer convenience only — fine if it doesn't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dashboard theme"
      className="rounded-full border border-current/15 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.12em] opacity-70 hover:opacity-100"
    >
      {theme === "dark" ? "light mode" : "dark mode"}
    </button>
  );
}
