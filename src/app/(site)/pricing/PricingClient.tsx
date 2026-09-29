"use client";
import Link from "next/link";
import { useState } from "react";

type Plan = {
  name: string; tag?: string; monthly: number | null; annual: number | null;
  blurb?: string; cta: string; ctaHref: string; note?: string; features: string[]; highlight?: boolean;
};

const teamPlans: Plan[] = [
  {
    name: "Team", tag: "For teams", monthly: 19, annual: 15, cta: "Start free trial", ctaHref: "/login",
    note: "/month / per user (2 user min) · 90 day guarantee", highlight: true,
    features: [
      "Unlimited meetings captured & instant AI summaries",
      "AI generated action items",
      "Conversational meeting assistant",
      "Playlists of highlights from meetings",
      "Collaboration using comments, folders, keyword alerts, + more",
    ],
  },
  {
    name: "Business", monthly: 34, annual: 25, cta: "Start free trial", ctaHref: "/login",
    note: "/month / per user (2 user min)",
    features: [
      "Everything from Team",
      "CRM field sync, updating records after meetings automatically",
      "Deal View summarizing insights",
      "Coaching metrics & AI scorecards",
      "Advanced call summaries, including custom summaries",
    ],
  },
  {
    name: "Enterprise", monthly: null, annual: null, cta: "Book a meeting", ctaHref: "/app?demo=1",
    note: "Talk to sales",
    features: [
      "Everything from Business",
      "Launch Assist Onboarding Program",
      "Organization-wide security controls",
      "SSO & SCIM provisioning",
      "Custom data retention programs",
      "Dedicated Success Manager & priority Support SLAs",
    ],
  },
];

const soloPlans: Plan[] = [
  {
    name: "Free", monthly: 0, annual: 0, cta: "Get started", ctaHref: "/login", note: "Free forever.", highlight: true,
    features: [
      "Unlimited recordings + transcriptions",
      "Choice of bot-free (in beta) or bot capture",
      "Instant AI call summaries",
      "Clips, playlists + search across calls",
    ],
  },
  {
    name: "Premium", monthly: 20, annual: 16, cta: "Start free trial", ctaHref: "/login", note: "/month",
    features: [
      "Everything from Free",
      "Advanced call summaries",
      "AI-generated action items",
      "Custom meeting bot",
    ],
  },
  {
    name: "Team trial", monthly: null, annual: null, cta: "Start free team trial (2+ users)", ctaHref: "/login",
    note: "Get the best plan for your team.",
    features: [
      "Everything from Premium",
      "Global search across calls",
      "Team folders, comments & mentions",
      "Talk to sales →",
    ],
  },
];

export function PricingClient() {
  const [aud, setAud] = useState<"teams" | "solo">("teams");
  const [cycle, setCycle] = useState<"annual" | "monthly">("annual");
  const plans = aud === "teams" ? teamPlans : soloPlans;
  return (
    <div>
      <div className="mt-10 flex flex-col items-center gap-5">
        <div className="flex rounded-full border border-white/20 p-1">
          {([["solo", "Individuals"], ["teams", "Teams"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setAud(k)} className={`rounded-full px-6 py-2 text-[0.9rem] transition ${aud === k ? "bg-offwhite text-black" : "text-offwhite/70"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[0.85rem] text-offwhite/70">
          <button onClick={() => setCycle("monthly")} className={cycle === "monthly" ? "text-white" : ""}>Monthly</button>
          <button
            onClick={() => setCycle(cycle === "annual" ? "monthly" : "annual")}
            aria-label="Toggle billing cycle"
            className="relative h-6 w-11 rounded-full bg-white/15"
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-brand-cyan transition-all ${cycle === "annual" ? "left-[22px]" : "left-0.5"}`} />
          </button>
          <button onClick={() => setCycle("annual")} className={cycle === "annual" ? "text-white" : ""}>
            Annually <span className="text-brand-yellow">(save 25%+)</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`flex flex-col rounded-3xl border p-8 ${p.highlight ? "border-brand-cyan bg-[#04141c]" : "border-white/12 bg-[#0b0b0c]"}`}>
            {p.tag && <div className="disp mb-2 text-[0.7rem] tracking-[0.14em] text-offwhite/50">{p.tag}</div>}
            <h3 className="h4 !font-medium">{p.name}</h3>
            <div className="mt-4 flex items-end gap-2">
              {p.monthly === null ? (
                <span className="h3 !text-[1.9rem]">Talk to sales</span>
              ) : (
                <>
                  {cycle === "annual" && p.monthly !== p.annual && (
                    <span className="h3 !text-[1.6rem] text-offwhite/40 line-through">${p.monthly}</span>
                  )}
                  <span className="h3 !text-[2.6rem]">${cycle === "annual" ? p.annual : p.monthly}</span>
                </>
              )}
            </div>
            {p.note && <div className="p-small mt-1 text-offwhite/55">{p.note}</div>}
            <Link href={p.ctaHref} className={`btn mt-6 !text-[0.8rem] ${p.highlight ? "btn-cyan" : "btn-outline"}`}>{p.cta}</Link>
            <ul className="mt-7 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="p-small flex gap-2.5 text-offwhite/80">
                  <span className="mt-0.5 text-brand-cyan" aria-hidden>✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
