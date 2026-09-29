"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/site/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(addr: string) {
    setBusy(true);
    await fetch("/api/auth", { method: "POST", body: JSON.stringify({ email: addr }) });
    router.push("/app");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <Link href="/" className="mb-10"><Logo /></Link>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0c] p-8">
        <h1 className="h3 !text-[1.6rem] text-center">Welcome to Fanthom</h1>
        <p className="p-small mt-2 text-center text-offwhite/60">
          This is a demo build – any email signs you into a seeded workspace. No password, no verification.
        </p>
        <form
          className="mt-7 space-y-3"
          onSubmit={(e) => { e.preventDefault(); go(email || "demo@fathomclone.app"); }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-white/15 bg-black px-4 py-3.5 text-offwhite outline-none transition focus:border-brand-cyan"
          />
          <button type="submit" disabled={busy} className="btn btn-cyan w-full disabled:opacity-60">
            {busy ? "Signing in…" : "Continue with email"}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-[0.75rem] text-offwhite/40">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>
        <button onClick={() => go("demo@fathomclone.app")} disabled={busy} className="btn btn-outline w-full !text-[0.8rem]">
          Explore the demo workspace →
        </button>
      </div>
      <p className="p-small mt-6 max-w-sm text-center text-offwhite/40">
        Real Fathom uses Google / Microsoft OAuth here. Faking auth was a deliberate scope call – the interesting product is behind it.
      </p>
    </div>
  );
}
