"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MEETINGS, PEOPLE, fmtClock, fmtDate } from "@/lib/data";

type Hit = { meetingId: string; title: string; date: string; at: number; speaker: string; text: string };

export function GlobalSearch() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const needle = q.trim().toLowerCase();

  const hits = useMemo<Hit[]>(() => {
    if (needle.length < 2) return [];
    const out: Hit[] = [];
    for (const m of MEETINGS) {
      for (const s of m.transcript) {
        if (s.text.toLowerCase().includes(needle)) {
          out.push({ meetingId: m.id, title: m.title, date: fmtDate(m.start), at: s.start, speaker: s.speaker, text: s.text });
        }
      }
    }
    return out.slice(0, 60);
  }, [needle]);

  const byMeeting = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const h of hits) map.set(h.meetingId, [...(map.get(h.meetingId) || []), h]);
    return [...map.entries()];
  }, [hits]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-medium">Search every call</h1>
      <p className="p-small mt-1 text-offwhite/50">Across {MEETINGS.length} meetings · transcripts, attendees, accounts</p>
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Try “pricing”, “DPA”, “competitor”, “beta”…'
        className="mt-5 w-full rounded-2xl border border-white/15 bg-[#101012] px-5 py-4 text-[1rem] outline-none transition focus:border-brand-cyan"
      />
      {needle.length >= 2 && (
        <div className="p-small mt-3 text-offwhite/45">
          {hits.length === 0 ? "No moments found." : `${hits.length} moment${hits.length > 1 ? "s" : ""} in ${byMeeting.length} meeting${byMeeting.length > 1 ? "s" : ""}`}
        </div>
      )}
      <div className="mt-4 space-y-5">
        {byMeeting.map(([mid, list]) => (
          <div key={mid} className="rounded-2xl border border-white/8 bg-[#101012] p-4">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <Link href={`/app/calls/${mid}`} className="font-medium text-offwhite hover:text-brand-cyan">{list[0].title}</Link>
              <span className="shrink-0 text-[0.7rem] text-offwhite/40">{list[0].date} · {list.length} hit{list.length > 1 ? "s" : ""}</span>
            </div>
            {list.slice(0, 4).map((h) => (
              <Link key={`${h.meetingId}-${h.at}`} href={`/app/calls/${h.meetingId}?t=${Math.floor(h.at)}`} className="block rounded-lg px-2 py-1.5 hover:bg-white/[0.04]">
                <span className="mr-2 font-mono text-[0.68rem] text-brand-cyan">{fmtClock(h.at)}</span>
                <span className="mr-2 text-[0.72rem] text-offwhite/50">{PEOPLE[h.speaker]?.name.split(" ")[0]}:</span>
                <span className="text-[0.78rem] text-offwhite/75">{snippet(h.text, needle)}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
      {needle.length < 2 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {["pricing", "DPA", "competitor", "adoption", "renewal", "beta", "security"].map((s) => (
            <button key={s} onClick={() => setQ(s)} className="rounded-full border border-white/15 px-4 py-2 text-[0.8rem] text-offwhite/70 transition hover:border-brand-cyan hover:text-brand-cyan">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function snippet(text: string, needle: string) {
  const i = text.toLowerCase().indexOf(needle);
  const from = Math.max(0, i - 40);
  const s = (from > 0 ? "…" : "") + text.slice(from, i) ;
  return (
    <>
      {s}
      <mark className="rounded bg-brand-yellow/90 px-0.5 text-black">{text.slice(i, i + needle.length)}</mark>
      {text.slice(i + needle.length, i + needle.length + 80)}{text.length > i + needle.length + 80 ? "…" : ""}
    </>
  );
}
