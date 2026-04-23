"use client";

import { Users, Edit2, Trash2, Plus } from "lucide-react";
import { COUNTRIES } from "@/lib/types";
import type { Member } from "@/lib/types";

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

type MemberRow = Member & {
  totalLocal: number;
  totalUSD: number;
  count: number;
  lastTx: { date: string; amount: number; currency: string } | null;
};

export default function MembersTable({
  rows,
  isAdmin,
  onEdit,
  onDelete,
  onAddFirst,
}: {
  rows: MemberRow[];
  isAdmin: boolean;
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
  onAddFirst: () => void;
}) {
  if (!rows.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-md p-12 text-center">
        <Users size={28} className="text-neutral-300 mx-auto mb-3" />
        <h3 className="font-display text-2xl mb-1">No members yet</h3>
        <p className="text-sm text-neutral-500 mb-5">
          {isAdmin
            ? "Add your first member to start tracking contributions."
            : "The admin hasn't added members yet."}
        </p>
        {isAdmin && (
          <button
            onClick={onAddFirst}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-forest rounded-md"
          >
            <Plus size={14} /> Add member
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-md overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl">Members</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Sorted by contribution in this period</p>
        </div>
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">
          {rows.length} total
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-neutral-500 border-b border-stone-200">
              <th className="text-left font-medium px-5 py-3">Member</th>
              <th className="text-left font-medium px-3 py-3">Country</th>
              <th className="text-right font-medium px-3 py-3">Total (local)</th>
              <th className="text-right font-medium px-3 py-3">In USD</th>
              <th className="text-left font-medium px-3 py-3">Latest payment</th>
              <th className="text-center font-medium px-3 py-3">Payments</th>
              {isAdmin && <th className="px-3 py-3 w-16"></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const country = COUNTRIES.find((c) => c.code === r.country_code);
              return (
                <tr
                  key={r.id}
                  className={`border-b border-stone-100 last:border-0 hover:bg-stone-50/60 transition group ${
                    i === 0 && r.totalUSD > 0 ? "bg-amber-50/30" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium bg-stone-100 text-forest">
                        {r.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        {r.note && <div className="text-xs text-neutral-500">{r.note}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-neutral-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-base">{country?.flag}</span>
                      <span className="text-xs">{r.country}</span>
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right font-mono text-sm">
                    {r.totalLocal > 0 ? (
                      fmtMoney(r.totalLocal, r.currency)
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right font-mono text-sm font-medium text-forest">
                    {fmtMoney(r.totalUSD, "USD")}
                  </td>
                  <td className="px-3 py-4 text-xs text-neutral-600">
                    {r.lastTx ? (
                      <div>
                        <div>{fmtDate(r.lastTx.date)}</div>
                        <div className="text-neutral-400 font-mono">
                          {fmtMoney(r.lastTx.amount, r.lastTx.currency)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-neutral-300">No payments</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-center text-xs text-neutral-500 num">{r.count}</td>
                  {isAdmin && (
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => onEdit(r)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-stone-100 rounded"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(r)}
                          className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-stone-100">
        {rows.map((r) => {
          const country = COUNTRIES.find((c) => c.code === r.country_code);
          return (
            <div key={r.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium bg-stone-100 text-forest">
                    {r.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-neutral-500">
                      {country?.flag} {r.country}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium text-forest">
                    {fmtMoney(r.totalUSD, "USD")}
                  </div>
                  {r.totalLocal > 0 && r.currency !== "USD" && (
                    <div className="text-xs text-neutral-400 font-mono">
                      {fmtMoney(r.totalLocal, r.currency)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
                <span>{r.count} payments</span>
                {r.lastTx && <span>Last: {fmtDate(r.lastTx.date)}</span>}
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onEdit(r)}
                    className="flex-1 py-1.5 text-xs border border-stone-200 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(r)}
                    className="flex-1 py-1.5 text-xs text-red-700 border border-red-200 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
