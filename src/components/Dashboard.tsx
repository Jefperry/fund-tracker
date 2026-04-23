"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Calendar, Filter, Check, AlertCircle } from "lucide-react";
import Header from "./Header";
import { StatCard } from "./atoms";
import MembersTable from "./MembersTable";
import TransactionsPanel from "./TransactionsPanel";
import MemberFormModal from "./MemberFormModal";
import TxFormModal from "./TxFormModal";
import ConfirmModal from "./ConfirmModal";
import { fetchExchangeRates } from "@/lib/fx";
import {
  addMember,
  updateMember,
  deleteMember,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/actions";
import type { Member, Transaction, ExchangeRates } from "@/lib/types";

const fmtMoney = (n: number, ccy = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: 2,
  }).format(n || 0);

type FilterKind = "all" | "month" | "week" | "biweekly" | "custom";

export default function Dashboard({
  initialMembers,
  initialTransactions,
  initialRates,
  isAuthenticated,
}: {
  initialMembers: Member[];
  initialTransactions: Transaction[];
  initialRates: ExchangeRates;
  isAuthenticated: boolean;
}) {
  const [members] = useState(initialMembers);
  const [transactions] = useState(initialTransactions);
  const [rates, setRates] = useState(initialRates);
  const [ratesUpdated, setRatesUpdated] = useState<string | undefined>(undefined);

  const [filter, setFilter] = useState<{
    kind: FilterKind;
    from: string | null;
    to: string | null;
  }>({ kind: "all", from: null, to: null });
  const [search, setSearch] = useState("");

  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    kind: "member" | "tx";
    id: string;
    label: string;
  } | null>(null);

  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  const showToast = (msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2600);
  };

  const handleRefreshRates = async () => {
    const newRates = await fetchExchangeRates();
    setRates(newRates);
    setRatesUpdated(new Date().toISOString());
  };

  // Compute filter window
  const window = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (filter.kind === "all") return { from: null, to: null };
    if (filter.kind === "month") {
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: null };
    }
    if (filter.kind === "week") {
      const f = new Date(startOfToday);
      f.setDate(f.getDate() - 7);
      return { from: f, to: null };
    }
    if (filter.kind === "biweekly") {
      const f = new Date(startOfToday);
      f.setDate(f.getDate() - 14);
      return { from: f, to: null };
    }
    if (filter.kind === "custom") {
      return {
        from: filter.from ? new Date(filter.from) : null,
        to: filter.to ? new Date(new Date(filter.to).setHours(23, 59, 59, 999)) : null,
      };
    }
    return { from: null, to: null };
  }, [filter]);

  // Filter transactions
  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (window.from && d < window.from) return false;
      if (window.to && d > window.to) return false;
      return true;
    });
  }, [transactions, window]);

  // Per-member aggregation
  const memberRows = useMemo(() => {
    const map = new Map();
    members.forEach((m) => {
      map.set(m.id, {
        ...m,
        totalLocal: 0,
        totalUSD: 0,
        count: 0,
        lastTx: null,
      });
    });
    filteredTx.forEach((t) => {
      const row = map.get(t.member_id);
      if (!row) return;
      row.totalUSD += t.amount_usd || 0;
      if (t.currency === row.currency) row.totalLocal += t.amount || 0;
      row.count += 1;
      if (!row.lastTx || new Date(t.date) > new Date(row.lastTx.date)) {
        row.lastTx = { date: t.date, amount: t.amount, currency: t.currency };
      }
    });
    let rows = Array.from(map.values());
    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(s) || r.country.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.totalUSD - a.totalUSD);
    return rows;
  }, [members, filteredTx, search]);

  const totalUSD = useMemo(
    () => filteredTx.reduce((a, t) => a + (t.amount_usd || 0), 0),
    [filteredTx]
  );
  const allTimeUSD = useMemo(
    () => transactions.reduce((a, t) => a + (t.amount_usd || 0), 0),
    [transactions]
  );

  const periodLabel: Record<FilterKind, string> = {
    all: "All time",
    month: "This month",
    week: "Last 7 days",
    biweekly: "Last 14 days",
    custom: "Custom range",
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
        <Header
          isAuthenticated={isAuthenticated}
          onRefreshRates={handleRefreshRates}
          ratesUpdated={ratesUpdated}
        />

        {/* HERO STATS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 anim-up">
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-md p-6 relative overflow-hidden">
            <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">
                {periodLabel[filter.kind]} · collected
              </div>
              <div className="font-display text-6xl md:text-7xl num leading-none text-forest">
                {fmtMoney(totalUSD, "USD")}
              </div>
              <div className="flex items-center gap-3 mt-4 text-xs text-neutral-500">
                <span>
                  {filteredTx.length} payment{filteredTx.length === 1 ? "" : "s"}
                </span>
                <span>·</span>
                <span>
                  {members.length} member{members.length === 1 ? "" : "s"}
                </span>
                {filter.kind !== "all" && (
                  <>
                    <span>·</span>
                    <span className="text-neutral-400">All-time {fmtMoney(allTimeUSD, "USD")}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <StatCard
            label="Avg per member"
            value={members.length ? fmtMoney(totalUSD / members.length, "USD") : fmtMoney(0, "USD")}
            hint={periodLabel[filter.kind].toLowerCase()}
          />
          <StatCard
            label="Top contributor"
            value={memberRows[0]?.totalUSD > 0 ? memberRows[0].name : "—"}
            hint={memberRows[0]?.totalUSD > 0 ? fmtMoney(memberRows[0].totalUSD, "USD") : "no payments yet"}
          />
        </section>

        {/* FILTER BAR */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 flex-wrap">
            {(
              [
                { k: "all", l: "All time" },
                { k: "month", l: "This month" },
                { k: "week", l: "Last week" },
                { k: "biweekly", l: "Last 2 weeks" },
                { k: "custom", l: "Custom" },
              ] as { k: FilterKind; l: string }[]
            ).map((opt) => (
              <button
                key={opt.k}
                onClick={() => setFilter({ ...filter, kind: opt.k })}
                className={`px-3 py-1.5 text-xs rounded-md transition border ${
                  filter.kind === opt.k
                    ? "text-white border-transparent bg-forest"
                    : "bg-white text-neutral-700 border-stone-200 hover:border-stone-400"
                }`}
              >
                {opt.l}
              </button>
            ))}

            {filter.kind === "custom" && (
              <div className="flex items-center gap-2 ml-2 anim-fade">
                <input
                  type="date"
                  value={filter.from || ""}
                  onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                  className="px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-md ring-focus"
                />
                <span className="text-neutral-400 text-xs">→</span>
                <input
                  type="date"
                  value={filter.to || ""}
                  onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                  className="px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-md ring-focus"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members"
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-md w-44 ring-focus"
              />
            </div>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-300 rounded-md hover:bg-stone-50"
                >
                  <Plus size={12} /> Member
                </button>
                <button
                  onClick={() => setShowAddTx(true)}
                  disabled={!members.length}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-forest rounded-md disabled:opacity-30"
                >
                  <Plus size={12} /> Record payment
                </button>
              </>
            )}
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MembersTable
              rows={memberRows}
              isAdmin={isAuthenticated}
              onEdit={(m) => setEditingMember(m)}
              onDelete={(m) =>
                setConfirmDelete({ kind: "member", id: m.id, label: m.name })
              }
              onAddFirst={() => setShowAddMember(true)}
            />
          </div>

          <div className="lg:col-span-1">
            <TransactionsPanel
              transactions={filteredTx}
              members={members}
              isAdmin={isAuthenticated}
              onEdit={(t) => setEditingTx(t)}
              onDelete={(t) => {
                const m = members.find((mem) => mem.id === t.member_id);
                setConfirmDelete({
                  kind: "tx",
                  id: t.id,
                  label: `${m?.name || "Payment"} · ${fmtMoney(t.amount, t.currency)}`,
                });
              }}
            />
          </div>
        </section>
      </div>

      {/* MODALS */}
      {showAddMember && (
        <MemberFormModal
          title="Add member"
          onClose={() => setShowAddMember(false)}
          onSubmit={async (data) => {
            await addMember(data);
            setShowAddMember(false);
            showToast("Member added.");
          }}
        />
      )}
      {editingMember && (
        <MemberFormModal
          title="Edit member"
          initial={editingMember}
          onClose={() => setEditingMember(null)}
          onSubmit={async (data) => {
            await updateMember(editingMember.id, data);
            setEditingMember(null);
            showToast("Member updated.");
          }}
        />
      )}
      {showAddTx && (
        <TxFormModal
          title="Record payment"
          members={members}
          rates={rates}
          onClose={() => setShowAddTx(false)}
          onSubmit={async (data) => {
            await addTransaction(data);
            setShowAddTx(false);
            showToast("Payment recorded.");
          }}
        />
      )}
      {editingTx && (
        <TxFormModal
          title="Edit payment"
          initial={editingTx}
          members={members}
          rates={rates}
          onClose={() => setEditingTx(null)}
          onSubmit={async (data) => {
            await updateTransaction(editingTx.id, data);
            setEditingTx(null);
            showToast("Payment updated.");
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          title={confirmDelete.kind === "member" ? "Remove member?" : "Delete payment?"}
          body={
            confirmDelete.kind === "member"
              ? `Remove ${confirmDelete.label} and all their payment history? This can't be undone.`
              : `Delete this payment (${confirmDelete.label})? This can't be undone.`
          }
          confirmLabel={confirmDelete.kind === "member" ? "Remove member" : "Delete payment"}
          onClose={() => setConfirmDelete(null)}
          onConfirm={async () => {
            if (confirmDelete.kind === "member") await deleteMember(confirmDelete.id);
            else await deleteTransaction(confirmDelete.id);
            setConfirmDelete(null);
            showToast(confirmDelete.kind === "member" ? "Member removed." : "Payment removed.");
          }}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 anim-up">
          <div
            className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm font-medium ${
              toast.kind === "err" ? "bg-red-900 text-white" : "bg-neutral-900 text-white"
            }`}
          >
            {toast.kind === "err" ? <AlertCircle size={16} /> : <Check size={16} />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
