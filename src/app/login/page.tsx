"use client";

import { useState } from "react";
import { signIn } from "./actions";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, Wallet } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-cream grain">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-sm flex items-center justify-center bg-forest">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="font-display text-2xl italic text-forest">Treasury</span>
          </div>
          <h1 className="font-display text-4xl mb-2">Admin sign-in</h1>
          <p className="text-sm text-neutral-500">
            This treasury accepts a single admin account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-md p-6 space-y-4 anim-up">
          <div className="flex items-start gap-3 p-3 rounded-md border border-stone-200 bg-stone-50">
            <Lock size={16} className="mt-0.5 text-neutral-500 shrink-0" />
            <p className="text-xs text-neutral-600">
              Only the admin credentials created during setup will be accepted.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1.5 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md ring-focus focus:border-stone-500 transition"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md ring-focus focus:border-stone-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md p-2.5 anim-fade">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2.5 rounded-md text-sm font-medium text-white bg-forest disabled:opacity-30 transition"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Not an admin? The dashboard is{" "}
          <a href="/view" className="underline hover:text-neutral-700">
            viewable here
          </a>{" "}
          (read-only).
        </p>
      </div>
    </div>
  );
}
