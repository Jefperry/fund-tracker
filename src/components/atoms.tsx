import { ReactNode } from "react";

export function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <label className="block text-[11px] uppercase tracking-widest text-neutral-500 mb-1.5 font-medium">
      {children}{" "}
      {optional && (
        <span className="text-neutral-300 normal-case tracking-normal">(optional)</span>
      )}
    </label>
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md ring-focus focus:border-stone-500 transition ${className}`}
    />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`px-3 py-2 text-sm bg-white border border-stone-300 rounded-md ring-focus focus:border-stone-500 transition ${className}`}
    >
      {children}
    </select>
  );
}

export function StatCard({
  label,
  value,
  hint,
  mono,
}: {
  label: string;
  value: string;
  hint?: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-md p-5">
      <div className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">{label}</div>
      <div
        className={`${mono ? "font-mono" : "font-display italic"} text-2xl text-ink`}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-neutral-500 mt-1">{hint}</div>}
    </div>
  );
}
