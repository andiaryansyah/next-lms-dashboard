"use client";

import { useEffect, useState } from "react";
import { getClientScheme, toggleScheme } from "@/lib/client/theme";

export default function ToggleTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const scheme = getClientScheme();
    setIsDark(scheme === "dark");
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next = toggleScheme();
    setIsDark(next === "dark");
  };

  if (!mounted) return null;

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        className="sr-only peer"
      />
      <div className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[4px] after:h-6 after:w-6 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
    </label>
  );
}
