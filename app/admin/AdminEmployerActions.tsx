"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2 } from "lucide-react";

interface Props {
  id: string;
  approved: boolean;
}

export function AdminEmployerActions({ id, approved }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    await fetch(`/api/admin/employers/${id}`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  }

  async function remove() {
    if (!confirm("Iş berijini we ähli bildirişlerini pozmak isleýärsiňizmi?")) return;
    setLoading(true);
    await fetch(`/api/admin/employers/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      {!approved && (
        <button
          onClick={approve}
          disabled={loading}
          title="Tassykla"
          className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      {approved && (
        <span className="text-xs text-green-600 font-medium px-2">✓ Tassyklanan</span>
      )}
      <button
        onClick={remove}
        disabled={loading}
        title="Poz"
        className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
