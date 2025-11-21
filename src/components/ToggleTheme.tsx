"use client";

import { toggleScheme, getCurrentScheme } from "@/lib/colorSheme";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleTheme() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ambil scheme dari cookies saat client mount
  useEffect(() => {
    const loadScheme = async () => {
      const scheme = await getCurrentScheme();
      setIsDark(scheme === "dark");
      setMounted(true);
    };
    loadScheme();
  }, []);

  // toggle dark/light
  const handleToggle = async () => {
    const newScheme = await toggleScheme();
    setIsDark(newScheme === "dark");
    router.refresh(); // refresh tampilan agar class dark di server ikut berubah
  };

  if (!mounted) return null; // hindari mismatch SSR/CSR

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        className="sr-only peer"
      />
      <div
        className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600
          rounded-full peer-focus:outline-none peer-focus:ring-4
          peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
          peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600
          after:content-[''] after:absolute after:top-0.5 after:left-[4px]
          after:bg-white after:border-gray-300 after:border after:rounded-full
          after:h-6 after:w-6 after:transition-all
          peer-checked:after:translate-x-full"
      ></div>
    </label>
  );
}
