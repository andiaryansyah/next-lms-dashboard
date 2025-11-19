"use client";

import { toggleScheme, getCurrentScheme } from "@/lib/colorSheme";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleTheme() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const scheme = await getCurrentScheme();
      setIsDark(scheme === "dark");
      setMounted(true);
    };
    load();
  }, []);

  const handleToggle = async () => {
    const newScheme = await toggleScheme();
    setIsDark(newScheme === "dark");
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
