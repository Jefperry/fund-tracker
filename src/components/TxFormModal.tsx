"use client";

import { useState, useMemo, useEffect } from "react";
import Modal from "./Modal";
import { Label, Input, Select } from "./atoms";
import { COUNTRIES, CURRENCIES } from "@/lib/types";
import type { Member, Transaction, ExchangeRates, Currency } from "@/lib/types";

const fmtMoney = (n: number, ccy = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: 2,
  }).format(n || 0);

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TxFormModal({
  title,
  initial,
  members,
  rates,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: Transaction;
  members: Member[];
  rates: ExchangeRates;
  onClose: () => void;
  onSubmit: (data: {
    member_id: string;
    amount: number;
    currency: Currency;
    amount_usd: number;
    rate_used: number;
    date: string;
    note: string;
  }) => Promise<void>;
}) {
  const [memberId, setMemberId] = useState(initial?.member_id || members[0]?.id || "");
  const member = members.find((m) => m.id === memberId);
  const [amount, setAmount] = useState(initial?.amount?.toString() || "");
  const [currency, setCurrency] = useState<Currency>(
    (initial?.currency as Currency) || (member?.currency as Currency) || "USD"
  );
  const [date, setDate] = useState(initial?.date?.slice(0, 10) || todayISO());
  const [note, setNote] = useState(initial?.note || "");
  const [lockUSD, setLockUSD] = useState(!!initial?.amount_usd);
  const [manualUSD, setManualUSD] = useState(initial?.amount_usd?.toString() || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member && !initial) setCurrency(member.currency as Currency);
  }, [member, initial]);

  const computedUSD = useMemo(() => {
    const a = Number(amount);
    if (!a || !rates[currency]) return 0;
    return a / rates[currency];
  }, [amount, currency, rates]);

  const finalUSD = lockUSD && manualUSD ? Number(manualUSD) : computedUSD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        member_id: memberId,
        amount: Number(amount),
        currency,
        amount_usd: Number(finalUSD.toFixed(2)),
        rate_used: rates[currency],
        date: new Date(date + "T12:00:00").toISOString(),
        note: note.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save payment");
    }
    setLoading(false);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Member</Label>
          <Select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {COUNTRIES.find((c) => c.code === m.country_code)?.flag} {m.name} (
                {m.currency})
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Label>Amount paid</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Date paid</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500">
              USD equivalent (locked)
            </span>
            <button
              type="button"
              onClick={() => setLockUSD(!lockUSD)}
              className="text-[11px] text-neutral-500 hover:text-neutral-900"
            >
              {lockUSD ? "Use live rate" : "Override"}
            </button>
          </div>
          {lockUSD ? (
            <Input
              type="number"
              step="0.01"
              value={manualUSD}
              onChange={(e) => setManualUSD(e.target.value)}
              placeholder={computedUSD.toFixed(2)}
              className="text-lg font-mono"
            />
          ) : (
            <div className="font-mono text-lg font-medium text-forest">
              {fmtMoney(computedUSD, "USD")}
            </div>
          )}
          <div className="text-[11px] text-neutral-500 mt-1">
            Rate: 1 USD = {rates[currency]?.toFixed(4) || "—"} {currency}. Stored value won't
            change with future FX.
          </div>
        </div>

        <div>
          <Label optional>Note</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Bi-weekly contribution Oct 1"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-stone-200 rounded-md hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !amount || !memberId}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-forest rounded-md disabled:opacity-30"
          >
            {initial ? "Save changes" : "Record payment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
