"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUSES = ["", "paid", "pending", "expired", "refunded"];
const LABELS: Record<string, string> = {
  "": "All",
  paid: "Paid",
  pending: "Pending",
  expired: "Expired",
  refunded: "Refunded",
};

export function OrderFilters({ activeStatus }: { activeStatus?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setStatus(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border transition-colors",
            (activeStatus ?? "") === s
              ? "border-[#ff6b1a] bg-[#ff6b1a]/10 text-[#ff6b1a]"
              : "border-[#2a2a2a] text-[#f5f1e8]/50 hover:border-[#f5f1e8]/30"
          )}
        >
          {LABELS[s]}
        </button>
      ))}
    </div>
  );
}
