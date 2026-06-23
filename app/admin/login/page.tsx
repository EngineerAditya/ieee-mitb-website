"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "forbidden"
      ? "Your account is not authorized for the admin dashboard."
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    // Only allow same-origin relative redirects (block open redirect).
    const redirectParam = searchParams.get("redirect");
    const redirect =
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//")
        ? redirectParam
        : "/admin";
    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--canvas)] px-4">
      <div className="glow-orange absolute inset-0" />
      <div className="relative w-full max-w-sm rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-8">
        <h1 className="mb-1 text-2xl text-[var(--ink)]">
          Admin <span className="text-[var(--accent)]">sign in</span>
        </h1>
        <p className="mb-6 text-sm text-[var(--muted)]">
          IEEE MIT Bengaluru dashboard
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--ink-2)]">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[3px] border border-[var(--line-strong)] bg-[var(--surface-2)] px-3 py-2 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--ink-2)]">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[3px] border border-[var(--line-strong)] bg-[var(--surface-2)] px-3 py-2 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[3px] bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-bright)] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
