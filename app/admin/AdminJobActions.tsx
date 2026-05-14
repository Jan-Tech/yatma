"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2, Star } from "lucide-react";

interface Props {
  id: string;
  status: string;
  featured: boolean;
}

export function AdminJobActions({ id, status, featured }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(body: object) {
    setLoading(true);
    await fetch(`/api/admin/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    setLoading(false);
  }

  async function remove() {
    if (!confirm("Iş bildirişini pozmak isleýärsiňizmi?")) return;
    setLoading(true);
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      {/* Feature toggle — only for active jobs */}
      {status === "ACTIVE" && (
        <button
          onClick={() => patch({ featured: !featured })}
          disabled={loading}
          title={featured ? "Öňe çykarmagy ýatyr" : "Öňe çykar"}
          className={`p-1.5 rounded-md disabled:opacity-50 ${
            featured
              ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
              : "bg-gray-100 text-gray-400 hover:bg-amber-100 hover:text-amber-600"
          }`}
        >
          <Star className="w-4 h-4" fill={featured ? "currentColor" : "none"} />
        </button>
      )}

      {/* Approve — for pending or rejected */}
      {(status === "PENDING" || status === "REJECTED") && (
        <button
          onClick={() => patch({ status: "ACTIVE" })}
          disabled={loading}
          title="Tassykla"
          className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
      )}

      {/* Reject — for pending or active */}
      {(status === "PENDING" || status === "ACTIVE") && (
        <button
          onClick={() => patch({ status: "REJECTED" })}
          disabled={loading}
          title="Ret et"
          className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Delete — always */}
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
