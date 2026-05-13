"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";

interface AdminActionsProps {
  type: "job" | "employer";
  id: string;
}

export function AdminActions({ type, id }: AdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function act(action: "approve" | "reject" | "delete") {
    setLoading(true);

    if (type === "employer" && action === "approve") {
      await fetch(`/api/admin/employers/${id}`, { method: "PATCH" });
    } else if (type === "job") {
      if (action === "approve") {
        await fetch(`/api/admin/jobs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACTIVE" }),
        });
      } else if (action === "reject") {
        await fetch(`/api/admin/jobs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REJECTED" }),
        });
      } else if (action === "delete") {
        await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      }
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {(type === "employer" || type === "job") && (
        <button
          onClick={() => act("approve")}
          disabled={loading}
          title="Tassykla"
          className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      {type === "job" && (
        <button
          onClick={() => act("reject")}
          disabled={loading}
          title="Ret et"
          className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {type === "job" && (
        <button
          onClick={() => act("delete")}
          disabled={loading}
          title="Poz"
          className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
