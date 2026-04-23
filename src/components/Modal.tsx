"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 anim-fade"
      style={{ background: "rgba(10,10,10,0.4)" }}
    >
      <div className="bg-white rounded-md shadow-2xl w-full max-w-md anim-up">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-display text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 hover:bg-stone-100 rounded"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
