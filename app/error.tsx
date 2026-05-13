"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Näsazlyk ýüze çykdy</h2>
      <p className="text-gray-500 mb-6">Bir zat ters gitdi. Gaýtadan synanşyň.</p>
      <button
        onClick={reset}
        className="bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700 font-medium"
      >
        Gaýtadan synap görüň
      </button>
    </div>
  );
}
