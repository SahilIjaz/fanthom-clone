import data from "@/data/meetings.json";

// A recreated recap-screen mockup rendered from the app's own seed data,
// so the marketing shot literally shows the product we built.
export function ProductShot() {
  const m = data.meetings[0];
  const people = data.people as Record<string, { name: string; color: string; initials: string }>;
  const byId = Object.fromEntries(Object.values(people).map((p: any) => [p.id, p]));
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#111214] text-left shadow-[0_40px_120px_rgba(0,190,255,0.12)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div>
          <div className="text-[0.95rem] font-medium text-offwhite">← {m.title}</div>
          <div className="text-[0.7rem] text-offwhite/45">Add to folder · Sep 28, 2026</div>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-white/15 px-3 py-1 text-[0.7rem] text-offwhite/80">Share</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[0.7rem] text-offwhite/80">🔗</span>
        </div>
      </div>
      <div className="flex gap-4 border-b border-white/10 px-5 pt-3 text-[0.8rem]">
        <span className="border-b-2 border-brand-cyan pb-2 font-medium text-brand-cyan">▶ Recap</span>
        <span className="pb-2 text-offwhite/55">Transcript</span>
        <span className="pb-2 text-offwhite/55">✦ Ask Fanthom</span>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-3 text-[0.95rem] font-medium">Summary <span className="ml-1 text-[0.7rem] text-brand-cyan underline">Change template</span></div>
          {m.summaries.chronological.blocks.slice(0, 3).map(([h, body]: string[]) => (
            <div key={h} className="mb-3">
              <div className="text-[0.8rem] font-medium text-offwhite">{h}</div>
              <p className="text-[0.72rem] leading-relaxed text-offwhite/55">{body.slice(0, 160)}…</p>
            </div>
          ))}
          <div className="mt-4 mb-2 text-[0.95rem] font-medium">Action Items</div>
          {m.actionItems.slice(0, 3).map((a: any) => (
            <div key={a.id} className="mb-1.5 flex items-start gap-2 text-[0.72rem] text-offwhite/75">
              <span className={`mt-0.5 inline-block h-3 w-3 rounded-sm border ${a.done ? "border-brand-cyan bg-brand-cyan" : "border-white/30"}`} />
              <span className={a.done ? "line-through opacity-60" : ""}>{a.text}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-[#1c2b3a] to-[#101820]">
            <div className="flex -space-x-2">
              {m.attendees.slice(0, 4).map((id: string) => (
                <span key={id} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111214] text-[0.65rem] font-medium text-black" style={{ background: byId[id]?.color }}>
                  {byId[id]?.initials}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 p-3">
            <div className="mb-2 text-[0.8rem] font-medium">Meeting details</div>
            {m.attendees.slice(0, 3).map((id: string) => (
              <div key={id} className="mb-2">
                <div className="flex items-center justify-between text-[0.7rem] text-offwhite/70">
                  <span>{byId[id]?.name}</span>
                  <span className="text-offwhite/40">{20 + (id.length * 7) % 40}%</span>
                </div>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className="h-1 flex-1 rounded-full" style={{ background: (i * 31 + id.length * 13) % 3 ? "rgba(255,255,255,0.12)" : byId[id]?.color }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
