"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TableSearchMessage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(`?search=${encodeURIComponent(query)}`);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query, router]);

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-[200px] bg-transparent outline-none p-4`}
      />
    </div>
  );
};

export default TableSearchMessage;
