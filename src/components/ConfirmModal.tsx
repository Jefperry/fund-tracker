"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function ConfirmModal({
  title,
  body,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
    setLoading(false);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-neutral-600 mb-5">{body}</p>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 text-sm border border-stone-200 rounded-md hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-900 disabled:opacity-30"
        >
          {loading ? "..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
