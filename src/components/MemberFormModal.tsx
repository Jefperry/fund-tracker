"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Label, Input, Select } from "./atoms";
import { COUNTRIES } from "@/lib/types";
import type { Member } from "@/lib/types";

export default function MemberFormModal({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: Member;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    country: string;
    country_code: string;
    currency: string;
    note: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [countryCode, setCountryCode] = useState(initial?.country_code || "US");
  const [note, setNote] = useState(initial?.note || "");
  const [loading, setLoading] = useState(false);

  const country = COUNTRIES.find((c) => c.code === countryCode)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        country: country.name,
        country_code: country.code,
        currency: country.currency,
        note: note.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save member");
    }
    setLoading(false);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            autoFocus
            required
          />
        </div>
        <div>
          <Label>Country & currency</Label>
          <Select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} — {c.currency}
              </option>
            ))}
          </Select>
          <p className="text-xs text-neutral-500 mt-1">
            Payments default to <span className="font-mono">{country.currency}</span>, but you
            can override per payment.
          </p>
        </div>
        <div>
          <Label optional>Note</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Co-founder, design lead"
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
            disabled={loading || !name.trim()}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-forest rounded-md disabled:opacity-30"
          >
            {initial ? "Save changes" : "Add member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
