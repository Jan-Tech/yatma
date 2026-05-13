"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, CATEGORIES } from "@/lib/constants";

export default function PostJobPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      city: fd.get("city") as string,
      category: fd.get("category") as string,
      salaryMin: fd.get("salaryMin") ? Number(fd.get("salaryMin")) : null,
      salaryMax: fd.get("salaryMax") ? Number(fd.get("salaryMax")) : null,
      currency: "TMT",
      phone: fd.get("phone") as string || null,
      whatsapp: fd.get("whatsapp") as string || null,
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Ýerleşdirmekde ýalňyşlyk");
      setLoading(false);
      return;
    }

    router.push("/employer/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Iş bildiriş ýerleşdir</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wezipäniň ady *
            </label>
            <input
              name="title"
              required
              placeholder="Mysal: Programmaçy, Satuwçy..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şäher *</label>
              <select
                name="city"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Şäher saýlaň</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ugur *</label>
              <select
                name="category"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Ugur saýlaň</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aýlyk iň azy (TMT)
              </label>
              <input
                name="salaryMin"
                type="number"
                min="0"
                placeholder="1500"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aýlyk iň köpi (TMT)
              </label>
              <input
                name="salaryMax"
                type="number"
                min="0"
                placeholder="3000"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Iş beýany we talaplary *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              placeholder="Borçlar, talaplar, iş şertleri..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                name="phone"
                type="tel"
                placeholder="+99312..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                name="whatsapp"
                type="tel"
                placeholder="+99312..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-md hover:bg-emerald-700 font-medium disabled:opacity-50"
          >
            {loading ? "Ýerleşdirilýär..." : "Iş bildiriş ýerleşdir"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Iş bildirişi admin tassyklanyndan soň çap ediler
          </p>
        </form>
      </div>
    </div>
  );
}
