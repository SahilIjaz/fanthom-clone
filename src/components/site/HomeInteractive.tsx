"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bob } from "./Fx";
import { SpaceFigure } from "./HeroArt";

/* ---- hero floating UI cards ---------------------------------------------- */
export function HeroCards() {
  return (
    <div className="pointer-events-none absolute inset-y-10 right-[max(1rem,calc((100vw-80rem)/2+2.5rem))] hidden w-[430px] lg:block" aria-hidden>
      <div className="fx-pop animate-floaty absolute right-0 top-2 w-64 rounded-2xl border border-white/10 bg-offblack p-4 shadow-2xl" style={{ animationDelay: "0s, .15s" }}>
        <div className="mb-2 flex items-center gap-2 text-[0.75rem] font-medium text-brand-cyan">✦ Ask Fanthom</div>
        <div className="rounded-xl bg-white/5 p-3 text-[0.72rem] text-offwhite/75">
          What did we commit to on the Brightloop call?
        </div>
        <div className="mt-2 rounded-xl bg-brand-cyan/10 p-3 text-[0.72rem] text-offwhite/85">
          You committed to sending the redlined DPA by Wednesday and the annual order form today.
        </div>
      </div>
      <div className="fx-pop animate-floaty absolute left-0 top-44 w-60 rounded-2xl border border-white/10 bg-offblack p-4 shadow-2xl" style={{ animationDelay: "1.4s, .4s" }}>
        <div className="mb-2 text-[0.75rem] font-medium text-offwhite">Project check-in</div>
        <div className="mb-2 flex -space-x-2">
          {["#00beff", "#ffa8bb", "#fff58c", "#9600ff"].map((c) => (
            <span key={c} className="h-7 w-7 rounded-full border-2 border-offblack" style={{ background: c }} />
          ))}
        </div>
        <div className="flex gap-2 text-[0.68rem]">
          <span className="rounded-full bg-white/10 px-2.5 py-1">✦ Summary</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">Action items</span>
        </div>
      </div>
      <Bob className="absolute bottom-16 left-40">
        <SpaceFigure size={120} />
      </Bob>
      <div className="fx-pop animate-floaty absolute bottom-0 right-10 h-36 w-36" style={{ animationDelay: "0.7s, .65s" }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <radialGradient id="hero-p" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#9fe8ff" /><stop offset="55%" stopColor="#00beff" /><stop offset="100%" stopColor="#014a66" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#hero-p)" />
          <ellipse cx="50" cy="52" rx="60" ry="14" fill="none" stroke="#ffa8bb" strokeWidth="3" transform="rotate(-16 50 50)" />
        </svg>
      </div>
    </div>
  );
}

/* ---- capture carousel ----------------------------------------------------- */
const slides = [
  {
    title: "Capture notes your way – bot or no bot – so you can stay focused on the meeting",
    art: "call",
  },
  { title: "AI summaries instantly available after your call", art: "summary" },
  { title: "Your meeting data, now inside ChatGPT, Claude, and more", art: "llm" },
  { title: "Automatically monitor key topics so you never miss critical moments", art: "topics" },
];

function SlideArt({ kind }: { kind: string }) {
  if (kind === "call")
    return (
      <div className="grid h-full grid-cols-2 gap-2 p-4">
        {["#2b3d52", "#52402b", "#2b522f", "#452b52"].map((c, i) => (
          <div key={c} className="flex items-center justify-center rounded-lg" style={{ background: c }}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm">{["👩🏽", "👨🏻", "👩🏼", "🧑🏾"][i]}</span>
          </div>
        ))}
      </div>
    );
  if (kind === "summary")
    return (
      <div className="space-y-2 p-5">
        <div className="h-2.5 w-2/5 rounded bg-brand-cyan/70" />
        {[5, 4, 4.5, 3, 4].map((w, i) => (
          <div key={i} className="h-2 rounded bg-white/15" style={{ width: `${w * 16}%` }} />
        ))}
        <div className="mt-3 h-2.5 w-1/3 rounded bg-brand-pink/70" />
        {[4.5, 3.5].map((w, i) => (
          <div key={i} className="h-2 rounded bg-white/15" style={{ width: `${w * 16}%` }} />
        ))}
      </div>
    );
  if (kind === "llm")
    return (
      <div className="flex h-full items-center justify-center gap-4 p-4">
        {["GPT", "Claude", "MCP"].map((l) => (
          <span key={l} className="disp rounded-2xl border border-white/20 px-5 py-4 text-lg text-offwhite/85">{l}</span>
        ))}
      </div>
    );
  return (
    <div className="space-y-3 p-5">
      {["Pricing mentioned", "Competitor: Otter", "Renewal risk"].map((t, i) => (
        <div key={t} className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-[0.78rem]">
          <span>{t}</span>
          <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-[0.65rem] font-medium text-black">{3 - i} hits</span>
        </div>
      ))}
    </div>
  );
}

export function CaptureCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {[i, (i + 1) % slides.length].map((idx, col) => (
          <div key={`${col}-${idx}`} className="fx-slide overflow-hidden rounded-2xl border border-white/15 bg-black/40 backdrop-blur">
            <p className="p-medium px-6 pt-6 text-offwhite">{slides[idx].title}</p>
            <div className="mt-4 h-56"><SlideArt kind={slides[idx].art} /></div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button aria-label="Previous" onClick={() => setI((i - 1 + slides.length) % slides.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-offwhite/80 hover:bg-white/10">←</button>
        {slides.map((_, d) => (
          <button key={d} aria-label={`Slide ${d + 1}`} onClick={() => setI(d)} className={`h-2 w-2 rounded-full ${d === i ? "bg-offwhite" : "bg-white/30"}`} />
        ))}
        <button aria-label="Next" onClick={() => setI((i + 1) % slides.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-offwhite/80 hover:bg-white/10">→</button>
      </div>
    </div>
  );
}

/* ---- teams / individuals tabs --------------------------------------------- */
const feats = {
  teams: [
    ["⚡", "Automatic notes, summaries, and updates reduce follow-ups and admin across the team."],
    ["🚀", "Turn conversations into clear next steps that move deals and projects forward."],
    ["📋", "Keep decisions, commitments, and customer signals visible across meetings and teams."],
    ["✨", "Spot patterns, risks, and opportunities across conversations before they become problems."],
  ],
  solo: [
    ["🎯", "Stay fully present — the notes write themselves while you talk."],
    ["📨", "Summaries and action items land in your inbox the moment the call ends."],
    ["🔍", "Search every call you have ever had, and jump to the exact moment."],
    ["🎬", "Clip the moment that matters and share it with anyone, on the call or not."],
  ],
} as const;

export function TeamsTabs() {
  const [tab, setTab] = useState<"teams" | "solo">("teams");
  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/8 bg-[#0b0b0c] p-8 sm:p-12">
      <div className="flex gap-8 border-b border-white/15 text-lg">
        {([["teams", "Fanthom for teams"], ["solo", "Fanthom for individuals"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`pb-3 transition ${tab === k ? "border-b-2 border-brand-yellow text-brand-yellow" : "text-offwhite/70 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h3 className="h4 !font-medium">
            {tab === "teams" ? "Shared visibility. Smarter execution." : "Your meetings, on autopilot."}
          </h3>
          <p className="p-regular mt-4 text-offwhite/70">
            {tab === "teams"
              ? "Fanthom gives teams a shared source of truth across every customer conversation, internal sync, and strategy call – so decisions are visible, follow-through is consistent, and nothing gets lost between meetings."
              : "Free forever for individuals: unlimited recordings, instant summaries, and search across everything you have said yes to."}
          </p>
          <p className="p-regular mt-3 text-offwhite/70">
            {tab === "teams"
              ? "Search conversations, spot patterns, and keep work moving without the manual work."
              : "No credit card, no trial clock, no bot in the room if you don't want one."}
          </p>
          <Link href="/pricing" className="btn btn-cyan mt-7 !text-[0.85rem]">See our pricing</Link>
        </div>
        <div className="grid gap-7 sm:grid-cols-2">
          {feats[tab].map(([icon, text]) => (
            <div key={text}>
              <div className="mb-2 text-2xl text-brand-cyan" aria-hidden>{icon}</div>
              <p className="p-small text-offwhite/75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- role carousel --------------------------------------------------------- */
const roles = [
  ["Sales", "Stay sharp, engage deeper, close faster", "Fanthom captures context, tracks engagement and updates your CRM, while you handle the close. AI Scorecards help managers coach with confidence."],
  ["Customer Success", "Stronger relationships, better retention", "Fanthom captures key moments, surfaces risks and opportunities, automates CRM updates and follow-ups, and spots trends across conversations."],
  ["Marketing", "Less clerical, more creative", "Spot trending feedback and changes in user sentiment, and harvest voice-of-customer gold from brainstorms, project calls, and interviews."],
  ["Operations", "Every decision, on the record", "Meetings become searchable institutional memory: decisions, owners, and deadlines extracted automatically."],
  ["HR & Talent", "Fair, consistent, documented", "Structured interview summaries and searchable debriefs keep hiring calibrated across every panel."],
  ["Product & Engineering", "From user call to backlog", "Customer pain points flow straight from calls into tickets, with the clip attached as evidence."],
] as const;

export function RoleCarousel() {
  const [off, setOff] = useState(0);
  return (
    <div className="relative mt-14 overflow-hidden">
      <div className="container-x mb-5 flex justify-end gap-3">
        <button aria-label="Back" onClick={() => setOff(Math.max(0, off - 1))} className="arrow_fx flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink text-black disabled:opacity-40" disabled={off === 0}>←</button>
        <button aria-label="Forward" onClick={() => setOff(Math.min(roles.length - 2, off + 1))} className="arrow_fx flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink text-black disabled:opacity-40" disabled={off >= roles.length - 2}>→</button>
      </div>
      <div className="flex gap-6 pl-[max(1rem,calc((100vw-80rem)/2+2.5rem))] transition-transform duration-500" style={{ transform: `translateX(calc(${-off} * (min(88vw, 30rem) + 1.5rem)))` }}>
        {roles.map(([title, kicker, body], idx) => (
          <div key={title} className="w-[min(88vw,30rem)] shrink-0 rounded-3xl border border-white/15 bg-[#0b0b0c] p-9 text-center">
            <h3 className="h4 !font-normal">{title}</h3>
            <div className="kicker mt-2 text-brand-pink">{kicker}</div>
            <p className="p-small mx-auto mt-4 max-w-[38ch] text-offwhite/70">{body}</p>
            <div className="mx-auto mt-7 flex h-28 items-end justify-center gap-1.5" aria-hidden>
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-2.5 rounded-t-full" style={{ height: `${18 + ((i * 37 + idx * 53) % 82)}%`, background: ["#00beff", "#ffa8bb", "#fff58c", "#9600ff", "#f55200"][(i + idx) % 5], opacity: 0.85 }} />
              ))}
            </div>
            <Link href="/login" className="btn btn-cyan mt-8 !py-3 !text-[0.75rem]">See Fanthom for {title.split(" ")[0]}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
