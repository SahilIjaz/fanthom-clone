"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MEETINGS, PEOPLE, fmtDate, fmtDur, fmtTime, platformLabel } from "@/lib/data";

const filters = ["All", "External", "Internal"] as const;

export function MeetingsList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    let l = [...MEETINGS].sort((a, b) => b.start.localeCompare(a.start));
    if (filter === "External") l = l.filter((m) => m.external);
    if (filter === "Internal") l = l.filter((m) => !m.external);
    if (q.trim()) {
      const needle = q.toLowerCase();
      l = l.filter(
        (m) =>
          m.title.toLowerCase().includes(needle) ||
          (m.account || "").toLowerCase().includes(needle) ||
          m.attendees.some((a) => PEOPLE[a]?.name.toLowerCase().includes(needle))
      );
    }
    return l;
  }, [filter, q]);

  const days = useMemo(() => {
    const map = new Map<string, typeof list>();
    for (const m of list) {
      const key = fmtDate(m.start);
      map.set(key, [...(map.get(key) || []), m]);
    }
    return [...map.entries()];
  }, [list]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">My Meetings</h1>
        <Link href="/app/live" className="btn btn-cyan !py-2.5 !text-[0.75rem]">◉ Record a meeting</Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-white/12 p-0.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-[0.8rem] transition ${filter === f ? "bg-white/10 text-white" : "text-offwhite/55"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by title, account, attendee…"
          className="min-w-52 flex-1 rounded-full border border-white/12 bg-transparent px-4 py-2 text-[0.85rem] outline-none transition focus:border-brand-cyan"
        />
      </div>

      {days.map(([day, items]) => (
        <section key={day} className="mt-8">
          <div className="disp mb-3 text-[0.7rem] tracking-[0.16em] text-offwhite/40">{day}</div>
          <div className="space-y-3">
            {items.map((m) => (
              <Link
                key={m.id}
                href={`/app/calls/${m.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-white/8 bg-[#101012] p-5 transition hover:border-brand-cyan/40 hover:bg-[#121216] sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[1.02rem] font-medium text-offwhite group-hover:text-white">{m.title}</span>
                    {m.external && (
                      <span className="rounded-full bg-brand-purple/25 px-2 py-0.5 text-[0.62rem] text-brand-pink">{m.account}</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-offwhite/50">
                    <span>{fmtTime(m.start)}</span>
                    <span>·</span><span>{fmtDur(m.durationSec)}</span>
                    <span>·</span><span>{platformLabel[m.platform]}</span>
                    <span>·</span><span>{m.kind}</span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-[0.78rem] text-offwhite/45">
                    {m.summaries.chronological?.blocks[0]?.[1]}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {m.attendees.slice(0, 5).map((id) => (
                      <span
                        key={id}
                        title={PEOPLE[id]?.name}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101012] text-[0.6rem] font-medium text-black"
                        style={{ background: PEOPLE[id]?.color }}
                      >
                        {PEOPLE[id]?.initials}
                      </span>
                    ))}
                    {m.attendees.length > 5 && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101012] bg-white/10 text-[0.6rem]">
                        +{m.attendees.length - 5}
                      </span>
                    )}
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-[0.7rem] text-offwhite/45">{m.actionItems.length} actions</div>
                    <div className="text-[0.7rem] text-offwhite/45">{m.highlights.length} highlights</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {days.length === 0 && (
        <div className="mt-16 rounded-2xl border border-dashed border-white/15 p-10 text-center text-offwhite/50">
          No meetings match. Clear the filter or record one.
        </div>
      )}
    </div>
  );
}
