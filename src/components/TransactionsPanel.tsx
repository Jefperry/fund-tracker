"use client";

import { TrendingUp } from "lucide-react";
import { COUNTRIES } from "@/lib/types";
import type { Member, Transaction } from "@/lib/types";

const fmtMoney = (n: number, ccy = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: 2,
  }).format(n || 0);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function TransactionsPanel({
  transactions,
  members,
  isAdmin,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  members: Member[];
  isAdmin: boolean;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}) {
  const memberById = (id: string) => members.find((m) => m.id === id);

  return (
    <div className="bg-white border border-stone-200 rounded-md overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-stone-200">
        <h3 className="font-display text-xl">Recent payments</h3>
        <p className="text-xs text-neutral-500 mt-0.5">{transactions.length} in current view</p>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <TrendingUp size={24} className="text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">No payments in this period.</p>
        </div>
      ) : (
        <div className="max-h-[640px] overflow-y-auto scrollbar-thin">
          {transactions.slice(0, 50).map((t) => {
            const m = memberById(t.member_id);
            return (
              <div
                key={t.id}
                className="px-5 py-3 border-b border-stone-100 last:border-0 hover:bg-stone-50/60 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {m?.name || "Removed member"}
                      </span>
                      {m && (
                        <span className="text-base">
                          {COUNTRIES.find((c) => c.code === m.country_code)?.flag}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">{fmtDate(t.date)}</div>
                    {t.note && (
                      <div className="text-xs text-neutral-400 italic mt-1 truncate">
                        "{t.note}"
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-mono text-sm font-medium">
                      {fmtMoney(t.amount, t.currency)}
                    </div>
                    {t.currency !== "USD" && (
                      <div className="text-xs text-neutral-400 font-mono">
                        ≈ {fmtMoney(t.amount_usd, "USD")}
                      </div>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 mt-2 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-900 px-2 py-0.5 rounded hover:bg-stone-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t)}
                      className="text-[11px] text-neutral-500 hover:text-red-700 px-2 py-0.5 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
