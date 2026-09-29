"use client";
import { useEffect, useRef, useState } from "react";
import { Meeting, PEOPLE, fmtClock } from "@/lib/data";

export function Transcript({ meeting, t, onSeek, clipRange }: {
  meeting: Meeting; t: number; onSeek: (s: number) => void; clipRange?: [number, number] | null;
}) {
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const activeId = meeting.transcript.find((s) => t >= s.start && t < s.end)?.id;

  // keep the active line in view while playing
  useEffect(() => {
    if (!activeId || q) return;
    const el = box.current?.querySelector(`[data-seg="${activeId}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId, q]);

  const needle = q.trim().toLowerCase();
  const rows = needle
    ? meeting.transcript.filter((s) => s.text.toLowerCase().includes(needle))
    : meeting.transcript;

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search this transcript…"
        className="mb-4 w-full rounded-lg border border-white/12 bg-[#131316] px-3 py-2 text-[0.8rem] outline-none transition focus:border-brand-cyan"
      />
      <div ref={box} className="space-y-3">
        {rows.map((s) => {
          const p = PEOPLE[s.speaker];
          const active = s.id === activeId;
          const inClip = clipRange && s.start >= clipRange[0] && s.start <= clipRange[1];
          return (
            <button
              key={s.id}
              data-seg={s.id}
              onClick={() => onSeek(s.start)}
              className={`block w-full rounded-lg px-2.5 py-2 text-left transition ${
                active ? "bg-brand-cyan/12" : inClip ? "bg-brand-yellow/8" : "hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2 text-[0.68rem] text-offwhite/45">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.5rem] font-bold text-black" style={{ background: p?.color }}>
                  {p?.initials}
                </span>
                <span className="font-medium text-offwhite/70">{p?.name}</span>
                <span className="font-mono">{fmtClock(s.start)}</span>
              </div>
              <p className={`mt-1 text-[0.8rem] leading-relaxed ${active ? "text-white" : "text-offwhite/70"}`}>
                {needle ? highlight(s.text, needle) : s.text}
              </p>
            </button>
          );
        })}
        {rows.length === 0 && <div className="py-8 text-center text-[0.8rem] text-offwhite/40">No lines match “{q}”.</div>}
      </div>
    </div>
  );
}

function highlight(text: string, needle: string) {
  const i = text.toLowerCase().indexOf(needle);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-brand-yellow px-0.5 text-black">{text.slice(i, i + needle.length)}</mark>
      {text.slice(i + needle.length)}
    </>
  );
}
