"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ME } from "@/lib/data";

// The capture layer is deliberately faked (stated in the walkthrough):
// this simulates a live bot-free recording session, then routes to the
// library — where the seeded meetings stand in for processed output.
const phases = [
  "Listening for meeting audio…",
  "Calendar match: “Weekly pipeline review” · joining bot-free",
  "Recording · transcribing live",
  "Detecting action items…",
  "Call ended · generating summary",
] as const;

export function LiveRecorder() {
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const script = [
    "Sahil: Okay, quick pipeline pass before the leadership sync.",
    "Sahil: Velocity moved to proposal — pilot terms went out yesterday.",
    "Sahil: Brightloop order form is signed pending the DPA redline.",
    "Sahil: Flag for next week: Northwind wants the security doc re-sent.",
  ];

  useEffect(() => {
    timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    const stages = [1200, 2600, 4400, 12000, 15000];
    const touts = stages.map((ms, i) => setTimeout(() => setPhase(i), ms));
    const lineTouts = script.map((_, i) => setTimeout(() => setLines((l) => [...l, script[i]]), 5200 + i * 1900));
    return () => {
      if (timer.current) clearInterval(timer.current);
      [...touts, ...lineTouts].forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = phase >= 4;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
      <h1 className="text-2xl font-medium">Bot-free capture</h1>
      <p className="p-small mt-1 text-offwhite/50">
        Simulated session — the capture layer is stubbed in this build, on purpose.
      </p>

      <div className="mt-8 rounded-3xl border border-white/10 bg-[#101012] p-8">
        <div className="flex items-center gap-4">
          <span className={`relative flex h-14 w-14 items-center justify-center rounded-full ${done ? "bg-brand-cyan/20" : "bg-red-500/15"}`}>
            {!done && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/30" />}
            <span className={`h-5 w-5 rounded-full ${done ? "bg-brand-cyan" : "bg-red-500"}`} />
          </span>
          <div>
            <div className="text-lg">{phases[phase]}</div>
            <div className="font-mono text-[0.8rem] text-offwhite/50">
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")} · {ME.name} · no bot visible to other participants
            </div>
          </div>
        </div>

        {phase >= 2 && !done && (
          <div className="mt-6 flex h-14 items-end gap-1">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 animate-pulse rounded-full bg-brand-cyan/70"
                style={{ height: `${15 + ((i * 37 + elapsed * 13) % 80)}%`, animationDelay: `${(i % 8) * 90}ms` }}
              />
            ))}
          </div>
        )}

        {lines.length > 0 && !done && (
          <div className="mt-6 space-y-2 border-t border-white/8 pt-5">
            {lines.map((l, i) => (
              <p key={i} className="text-[0.82rem] text-offwhite/70">{l}</p>
            ))}
          </div>
        )}

        {done && (
          <div className="mt-7 rounded-2xl border border-brand-cyan/30 bg-brand-cyan/8 p-5">
            <div className="font-medium text-brand-cyan">Summary ready</div>
            <p className="p-small mt-1 text-offwhite/70">
              In the real product this call would now appear in your library with its recap, transcript and action items. The seeded meetings show exactly what that looks like.
            </p>
            <Link href="/app" className="btn btn-cyan mt-4 !py-2.5 !text-[0.75rem]">Open my meetings</Link>
          </div>
        )}
      </div>
    </div>
  );
}
