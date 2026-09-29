"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActionItem, Highlight, Meeting, PEOPLE, fmtClock, fmtDate, fmtDur, fmtTime, platformLabel } from "@/lib/data";
import { Player } from "./Player";
import { Transcript } from "./Transcript";
import { AskPanel } from "./AskPanel";

type Tab = "recap" | "transcript" | "ask";

// Local mutations (checkbox state, custom highlights) persist per-browser.
function useLocal<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setV(JSON.parse(raw)); } catch {}
  }, [key]);
  const set = useCallback((nv: T) => {
    setV(nv);
    try { localStorage.setItem(key, JSON.stringify(nv)); } catch {}
  }, [key]);
  return [v, set];
}

export function CallView({ meeting, readOnly = false, clipOnly }: {
  meeting: Meeting; readOnly?: boolean; clipOnly?: [number, number] | null;
}) {
  const params = useSearchParams();
  const deepT = params?.get("t");
  const [tab, setTab] = useState<Tab>(deepT ? "transcript" : "recap");
  const [t, setT] = useState(clipOnly ? clipOnly[0] : deepT ? Number(deepT) || 0 : 0);
  const [playing, setPlaying] = useState(false);
  const [template, setTemplate] = useState(Object.keys(meeting.summaries)[0]);
  const [doneMap, setDoneMap] = useLocal<Record<string, boolean>>(`fz-done-${meeting.id}`, {});
  const [extraHl, setExtraHl] = useLocal<Highlight[]>(`fz-hl-${meeting.id}`, []);
  const [clip, setClip] = useState<[number, number] | null>(clipOnly ?? null);
  const [copied, setCopied] = useState<string | null>(null);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  // playback clock
  useEffect(() => {
    if (!playing) { if (raf.current) cancelAnimationFrame(raf.current); return; }
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setT((v) => {
        const end = clipOnly ? clipOnly[1] : meeting.durationSec;
        const nv = v + dt * 8; // 8x demo speed: an hour call scrubs in minutes
        if (nv >= end) { setPlaying(false); return end; }
        return nv;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, meeting.durationSec, clipOnly]);

  const seek = useCallback((sec: number) => {
    setT(clipOnly ? Math.max(clipOnly[0], Math.min(clipOnly[1], sec)) : sec);
  }, [clipOnly]);

  const highlights = useMemo(
    () => [...meeting.highlights, ...extraHl].sort((a, b) => a.at - b.at),
    [meeting.highlights, extraHl]
  );

  const actions: ActionItem[] = meeting.actionItems.map((a) => ({ ...a, done: doneMap[a.id] ?? a.done }));

  async function copy(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(label); setTimeout(() => setCopied(null), 1800);
  }

  function shareUrl(range?: [number, number] | null) {
    const base = typeof window === "undefined" ? "" : window.location.origin;
    if (range) {
      const tok = btoa(`${meeting.id}:${Math.round(range[0])}:${Math.round(range[1])}`)
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return `${base}/share/clip/${tok}`;
    }
    return `${base}/share/${meeting.shareToken}`;
  }

  function addHighlight() {
    const seg = meeting.transcript.find((s) => t >= s.start && t < s.end);
    const label = seg ? `${PEOPLE[seg.speaker]?.name.split(" ")[0]}: “${seg.text.slice(0, 60)}…”` : `Moment at ${fmtClock(t)}`;
    setExtraHl([...extraHl, { id: `local-${Date.now()}`, at: Math.round(t), label, by: "u-sahil" }]);
  }

  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-offwhite/50">
      <span>{fmtDate(meeting.start)} · {fmtTime(meeting.start)}</span>
      <span>·</span><span>{fmtDur(meeting.durationSec)}</span>
      <span>·</span><span>{platformLabel[meeting.platform]}</span>
      {meeting.account && (<><span>·</span><span className="text-brand-pink">{meeting.account}</span></>)}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {!readOnly && (
            <Link href="/app" className="mb-1 inline-block text-[0.8rem] text-offwhite/50 hover:text-white">← My Meetings</Link>
          )}
          <h1 className="text-xl font-medium sm:text-2xl">{meeting.title}</h1>
          <div className="mt-1">{meta}</div>
        </div>
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={addHighlight} className="rounded-full border border-brand-pink/50 px-4 py-2 text-[0.78rem] text-brand-pink transition hover:bg-brand-pink/10">
              ✦ Highlight this moment
            </button>
            <button
              onClick={() => setClip(clip ? null : [Math.max(0, t - 30), Math.min(meeting.durationSec, t + 30)])}
              className={`rounded-full border px-4 py-2 text-[0.78rem] transition ${clip ? "border-brand-yellow bg-brand-yellow/15 text-brand-yellow" : "border-white/20 text-offwhite/80 hover:border-white/50"}`}
            >
              ✂ {clip ? "Clip armed" : "Create clip"}
            </button>
            <button onClick={() => copy(shareUrl(clip), clip ? "clip" : "call")} className="btn btn-cyan !py-2.5 !text-[0.72rem]">
              {copied ? `${copied === "clip" ? "Clip" : "Call"} link copied ✓` : clip ? "Copy clip link" : "Share"}
            </button>
          </div>
        )}
      </div>

      {clip && !readOnly && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-brand-yellow/40 bg-brand-yellow/8 px-4 py-2.5 text-[0.78rem] text-brand-yellow">
          Clip {fmtClock(clip[0])} – {fmtClock(clip[1])}
          <button onClick={() => setClip([Math.max(0, clip[0] - 15), clip[1]])} className="rounded border border-brand-yellow/40 px-2">−15s</button>
          <button onClick={() => setClip([clip[0], Math.min(meeting.durationSec, clip[1] + 15)])} className="rounded border border-brand-yellow/40 px-2">+15s</button>
          <span className="text-brand-yellow/70">Anyone with the link can watch just this range — no sign-in.</span>
        </div>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <Player meeting={meeting} t={t} playing={playing} onSeek={seek} onToggle={() => setPlaying(!playing)} clipRange={clip} />
          {highlights.length > 0 && (
            <div className="mt-4">
              <div className="disp mb-2 text-[0.65rem] tracking-[0.16em] text-offwhite/40">Highlights</div>
              <div className="flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <button key={h.id} onClick={() => seek(h.at)} className="max-w-full truncate rounded-full border border-brand-pink/35 px-3 py-1.5 text-[0.72rem] text-brand-pink/90 transition hover:bg-brand-pink/10">
                    {fmtClock(h.at)} · {h.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex gap-1 rounded-xl border border-white/8 bg-[#0d0d0f] p-1">
            {([["recap", "▶ Recap"], ["transcript", "Transcript"], ["ask", "✦ Ask Fanthom"]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-lg px-3 py-2 text-[0.8rem] transition ${tab === k ? "bg-brand-cyan/15 text-brand-cyan" : "text-offwhite/60 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="thin-scroll mt-3 max-h-[560px] overflow-y-auto rounded-xl border border-white/8 bg-[#0d0d0f] p-5">
            {tab === "recap" && (
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-[0.95rem] font-medium">Summary</span>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="rounded-lg border border-white/15 bg-[#131316] px-2.5 py-1.5 text-[0.75rem] text-offwhite/85 outline-none"
                  >
                    {Object.entries(meeting.summaries).map(([k, s]) => (
                      <option key={k} value={k}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {meeting.summaries[template].blocks.map(([h, body]) => (
                  <div key={h} className="mb-4">
                    <div className="text-[0.85rem] font-medium text-offwhite">{h}</div>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-offwhite/60">{body}</p>
                  </div>
                ))}
                <div className="mt-6 mb-2 flex items-center justify-between">
                  <span className="text-[0.95rem] font-medium">Action items</span>
                  <button
                    onClick={() => copy(actions.map((a) => `${a.done ? "[x]" : "[ ]"} ${a.text} — ${PEOPLE[a.owner]?.name}, ${a.due}`).join("\n"), "actions")}
                    className="text-[0.7rem] text-brand-cyan hover:underline"
                  >
                    {copied === "actions" ? "Copied ✓" : "Copy all"}
                  </button>
                </div>
                {actions.map((a) => (
                  <div key={a.id} className="mb-2 flex items-start gap-2.5 rounded-lg px-1 py-1 hover:bg-white/[0.03]">
                    <button
                      disabled={readOnly}
                      onClick={() => setDoneMap({ ...doneMap, [a.id]: !a.done })}
                      aria-label={a.done ? "Mark open" : "Mark done"}
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.6rem] transition ${a.done ? "border-brand-cyan bg-brand-cyan text-black" : "border-white/30 hover:border-brand-cyan"}`}
                    >
                      {a.done ? "✓" : ""}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[0.8rem] ${a.done ? "text-offwhite/40 line-through" : "text-offwhite/85"}`}>{a.text}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[0.68rem] text-offwhite/45">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.5rem] font-bold text-black" style={{ background: PEOPLE[a.owner]?.color }}>
                          {PEOPLE[a.owner]?.initials}
                        </span>
                        {PEOPLE[a.owner]?.name} · {a.due} ·
                        <button onClick={() => seek(a.at)} className="text-brand-cyan hover:underline">said at {fmtClock(a.at)}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "transcript" && (
              <Transcript meeting={meeting} t={t} onSeek={seek} clipRange={clip} />
            )}
            {tab === "ask" && <AskPanel meeting={meeting} onSeek={seek} />}
          </div>
        </div>
      </div>
    </div>
  );
}
