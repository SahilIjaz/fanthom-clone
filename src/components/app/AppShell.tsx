"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/site/Logo";
import { ME } from "@/lib/data";

const nav = [
  ["My Meetings", "/app", "🏠"],
  ["Team", "/app/team", "👥"],
  ["Search", "/app/search", "🔍"],
] as const;

export function AppShell({ email, children }: { email: string; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-offwhite">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/8 bg-[#0d0d0f] p-4 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <LogoMark size={26} />
          <span className="text-lg font-semibold tracking-tight">fanthom</span>
        </Link>
        <nav className="space-y-1">
          {nav.map(([label, href, icon]) => {
            const active = href === "/app" ? path === "/app" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9rem] transition ${
                  active ? "bg-brand-cyan/12 text-brand-cyan" : "text-offwhite/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span aria-hidden>{icon}</span> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 border-t border-white/8 pt-4">
          <div className="disp px-3 pb-2 text-[0.65rem] tracking-[0.16em] text-offwhite/40">Topic monitors</div>
          {["Pricing", "Competitor mentions", "Renewal"].map((t) => (
            <Link key={t} href={`/app/search?q=${encodeURIComponent(t)}`} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.82rem] text-offwhite/60 hover:text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" /> {t}
            </Link>
          ))}
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-3 rounded-xl border border-white/8 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-medium text-black" style={{ background: ME.color }}>
              {ME.initials}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[0.8rem]">{ME.name}</div>
              <div className="truncate text-[0.68rem] text-offwhite/45">{email}</div>
            </div>
          </div>
          <button
            onClick={async () => { await fetch("/api/auth", { method: "DELETE" }); router.push("/"); }}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-[0.78rem] text-offwhite/50 hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-60">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/8 bg-[#0a0a0b]/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/app" className="flex items-center gap-2"><LogoMark size={22} /><b>fanthom</b></Link>
          <div className="ml-auto flex gap-4 text-[0.85rem]">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className={path === href ? "text-brand-cyan" : "text-offwhite/70"}>{label}</Link>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
