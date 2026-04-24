"use client";

import { Wallet, RefreshCw, LogOut, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({
  isAuthenticated,
  onRefreshRates,
  ratesUpdated,
}: {
  isAuthenticated: boolean;
  onRefreshRates: () => void;
  ratesUpdated?: string;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/auth/signout", { method: "POST" });
    router.refresh();
  };

  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <header className="flex items-center justify-between mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-stone-200">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-sm flex items-center justify-center bg-forest">
          <Wallet size={18} className="text-white" />
        </div>
        <div>
          <div className="font-display text-2xl italic leading-none text-forest">Treasury</div>
          <div className="text-[11px] uppercase tracking-widest text-neutral-500 mt-1 hidden sm:block">
            Team contributions ledger
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefreshRates}
          title={ratesUpdated ? `FX updated ${fmtDateTime(ratesUpdated)}` : "Refresh FX"}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-stone-100"
        >
          <RefreshCw size={12} /> FX
        </button>
        {isAuthenticated ? (
          <>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 border border-stone-200 rounded-md hover:bg-stone-50"
            >
              <LogOut size={12} /> Sign out
            </button>
            <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-wider rounded-md bg-forest text-white">
              <Lock size={10} /> Admin
            </span>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-forest rounded-md"
          >
            <LogIn size={12} /> Admin sign-in
          </button>
        )}
      </div>
    </header>
  );
}
