"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  cities: string[];
  categories: string[];
}

export function SearchFilters({ cities, categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");

  const apply = useCallback(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    router.push(`/?${params.toString()}`);
  }, [q, city, category, router]);

  const reset = useCallback(() => {
    setQ("");
    setCity("");
    setCategory("");
    router.push("/");
  }, [router]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Wezipe, açar söz..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">Ähli şäherler</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">Ähli ugurlar</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button
        onClick={apply}
        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700"
      >
        Gözle
      </button>

      {(q || city || category) && (
        <button
          onClick={reset}
          className="text-sm text-gray-500 hover:text-gray-800 px-2"
        >
          Arassala
        </button>
      )}
    </div>
  );
}
