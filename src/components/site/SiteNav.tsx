"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const solutions = [
  ["For Sales", "/pricing"],
  ["For Marketing", "/pricing"],
  ["For Customer Success", "/pricing"],
  ["For Teams", "/pricing"],
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  return (
    <header data-btn-swap="top" className="group/nav sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md transition-colors duration-300 data-[btn-swap=scrolled]:bg-black/95">
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="Fanthom home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-[0.95rem] font-normal text-offwhite/85 lg:flex">
          <Link href="/" className="nav_link_fx">Overview</Link>
          <div className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
            <button className="nav_link_fx flex items-center gap-1">
              Solutions <span className="text-[10px]">▾</span>
            </button>
            {drop && (
              <div className="absolute left-0 top-full w-56 rounded-2xl border border-white/10 bg-offblack p-2 shadow-2xl">
                {solutions.map(([label, href]) => (
                  <Link key={label} href={href} className="block rounded-xl px-4 py-2.5 hover:bg-white/5">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/pricing" className="nav_link_fx">Pricing</Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/app?demo=1" className="nav_link_fx p-small px-3 py-2 text-offwhite/85">
            Book a Demo
          </Link>
          <Link href="/login" className="nav_link_fx p-small px-3 py-2 text-offwhite/85">
            Log In
          </Link>
          <Link href="/login" className="btn btn-white !py-3 !text-[0.85rem]">Sign up free</Link>
        </div>
        <button
          className="lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-offwhite" />
            <span className="block h-0.5 w-6 bg-offwhite" />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-black px-6 py-4 lg:hidden">
          {[
            ["Overview", "/"],
            ["Pricing", "/pricing"],
            ["Book a Demo", "/app?demo=1"],
            ["Log In", "/login"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="block py-3 text-lg" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/login" className="btn btn-cyan mt-3 w-full" onClick={() => setOpen(false)}>
            Sign up free
          </Link>
        </div>
      )}
    </header>
  );
}
