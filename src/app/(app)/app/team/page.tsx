import Link from "next/link";
import { MEETINGS, PEOPLE, fmtDate, fmtDur } from "@/lib/data";

export const metadata = { title: "Team – Fanthom" };

export default function TeamPage() {
  const teammates = Object.values(PEOPLE).filter((p) => p.team);
  const recent = [...MEETINGS].sort((a, b) => b.start.localeCompare(a.start));
  const openActions = MEETINGS.flatMap((m) =>
    m.actionItems.filter((a) => !a.done).map((a) => ({ ...a, meeting: m }))
  );
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-medium">Team workspace</h1>
      <p className="p-small mt-1 text-offwhite/50">Shared visibility across every recorded conversation.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {teammates.map((p) => (
          <div key={p.id} className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#101012] py-1.5 pl-1.5 pr-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[0.65rem] font-semibold text-black" style={{ background: p.color }}>{p.initials}</span>
            <div>
              <div className="text-[0.8rem] leading-tight">{p.name}</div>
              <div className="text-[0.65rem] text-offwhite/45">{p.role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="disp mb-3 text-[0.7rem] tracking-[0.16em] text-offwhite/40">Team recordings</h2>
          <div className="space-y-2.5">
            {recent.map((m) => (
              <Link key={m.id} href={`/app/calls/${m.id}`} className="block rounded-xl border border-white/8 bg-[#101012] p-3.5 transition hover:border-brand-cyan/40">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[0.88rem]">{m.title}</span>
                  <span className="shrink-0 text-[0.68rem] text-offwhite/40">{fmtDate(m.start)}</span>
                </div>
                <div className="mt-1 text-[0.7rem] text-offwhite/45">
                  Host {PEOPLE[m.host]?.name.split(" ")[0]} · {fmtDur(m.durationSec)} · {m.attendees.length} people
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h2 className="disp mb-3 text-[0.7rem] tracking-[0.16em] text-offwhite/40">Open action items · {openActions.length}</h2>
          <div className="space-y-2.5">
            {openActions.map((a) => (
              <Link key={`${a.meeting.id}-${a.id}`} href={`/app/calls/${a.meeting.id}`} className="block rounded-xl border border-white/8 bg-[#101012] p-3.5 transition hover:border-brand-cyan/40">
                <div className="text-[0.8rem] text-offwhite/85">{a.text}</div>
                <div className="mt-1.5 flex items-center gap-2 text-[0.68rem] text-offwhite/45">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.5rem] font-bold text-black" style={{ background: PEOPLE[a.owner]?.color }}>
                    {PEOPLE[a.owner]?.initials}
                  </span>
                  {PEOPLE[a.owner]?.name} · due {a.due} · from “{a.meeting.title}”
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
