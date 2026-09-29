"use client";
import { useEffect, useRef } from "react";
import { Meeting, PEOPLE, fmtClock } from "@/lib/data";

// Faked capture layer: a synthetic "recording" driven by the transcript clock.
// Speaker tiles light up while their segment is active; the scrubber drives
// the same clock the transcript and highlights are synced to.
export function Player({
  meeting, t, playing, onSeek, onToggle, clipRange,
}: {
  meeting: Meeting; t: number; playing: boolean;
  onSeek: (sec: number) => void; onToggle: () => void;
  clipRange?: [number, number] | null;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const active = meeting.transcript.find((s) => t >= s.start && t < s.end);
  const cols = meeting.attendees.length <= 4 ? 2 : meeting.attendees.length <= 6 ? 3 : 4;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); onToggle(); }
      if (e.code === "ArrowRight") onSeek(Math.min(meeting.durationSec, t + 15));
      if (e.code === "ArrowLeft") onSeek(Math.max(0, t - 15));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t, onSeek, onToggle, meeting.durationSec]);

  function seekFromPointer(e: React.PointerEvent) {
    const r = barRef.current!.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * meeting.durationSec);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d1117]">
      <div className={`grid gap-1.5 p-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {meeting.attendees.map((id) => {
          const p = PEOPLE[id];
          const speaking = active?.speaker === id;
          return (
            <div
              key={id}
              className={`relative flex aspect-video flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                speaking ? "ring-2 ring-brand-cyan" : "ring-1 ring-white/5"
              }`}
              style={{ background: `linear-gradient(150deg, ${p.color}26, #10151b 70%)` }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-[0.72rem] font-semibold text-black sm:h-12 sm:w-12"
                style={{ background: p.color }}
              >
                {p.initials}
              </span>
              {speaking && (
                <span className="absolute bottom-1.5 right-2 flex items-end gap-0.5" aria-label="speaking">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1 animate-pulse rounded-full bg-brand-cyan" style={{ height: 6 + ((i * 5 + Math.floor(t)) % 8), animationDelay: `${i * 120}ms` }} />
                  ))}
                </span>
              )}
              <span className="absolute bottom-1.5 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[0.6rem] text-offwhite/85">{p.name.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-4">
        <div
          ref={barRef}
          className="group relative h-8 cursor-pointer"
          onPointerDown={(e) => { seekFromPointer(e); }}
        >
          {/* waveform: deterministic pseudo-random bars */}
          <div className="absolute inset-x-0 top-1/2 flex h-6 -translate-y-1/2 items-center gap-[2px]">
            {Array.from({ length: 120 }).map((_, i) => {
              const pos = (i / 120) * meeting.durationSec;
              const played = pos <= t;
              const inClip = clipRange && pos >= clipRange[0] && pos <= clipRange[1];
              const h = 20 + ((i * 2654435761) % 80);
              return (
                <span
                  key={i}
                  className="flex-1 rounded-full transition-colors"
                  style={{
                    height: `${h}%`,
                    background: inClip ? "var(--yellow)" : played ? "var(--cyan)" : "rgba(255,255,255,0.14)",
                  }}
                />
              );
            })}
          </div>
          {meeting.highlights.map((h) => (
            <span
              key={h.id}
              title={h.label}
              className="absolute top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-pink"
              style={{ left: `${(h.at / meeting.durationSec) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center gap-4">
          <button
            onClick={onToggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan text-black transition hover:scale-105"
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <span className="font-mono text-[0.8rem] text-offwhite/70">
            {fmtClock(t)} <span className="text-offwhite/35">/ {fmtClock(meeting.durationSec)}</span>
          </span>
          <div className="ml-auto flex gap-1.5">
            {[1, 1.5, 2].map((r) => (
              <span key={r} className="rounded-md border border-white/10 px-2 py-1 text-[0.68rem] text-offwhite/55">{r}×</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
