"use client";
import { useState } from "react";
import { Meeting, PEOPLE, fmtClock } from "@/lib/data";

type Msg = { role: "user" | "ai"; text: string; cites?: { at: number; label: string }[] };

// Deterministic retrieval "AI": keyword-scores transcript segments and
// composes an answer with citations. No external model — a stated scope call.
function answer(meeting: Meeting, q: string): Msg {
  const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const scored = meeting.transcript
    .map((s) => ({ s, score: words.reduce((n, w) => n + (s.text.toLowerCase().includes(w) ? 1 : 0), 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (!scored.length) {
    return { role: "ai", text: "I could not find that in this call. Try different words, or ask about action items, decisions, or pricing." };
  }
  const cites = scored.map(({ s }) => ({ at: s.start, label: `${PEOPLE[s.speaker]?.name.split(" ")[0]} at ${fmtClock(s.start)}` }));
  const lead = scored[0].s;
  return {
    role: "ai",
    text: `${PEOPLE[lead.speaker]?.name} addressed this: “${lead.text.length > 220 ? lead.text.slice(0, 220) + "…" : lead.text}”${scored.length > 1 ? ` Related moments are cited below.` : ""}`,
    cites,
  };
}

const suggestions = ["What did we commit to?", "Was pricing discussed?", "Any compliance concerns?", "What are the risks?"];

export function AskPanel({ meeting, onSeek }: { meeting: Meeting; onSeek: (s: number) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  function ask(q: string) {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, answer(meeting, q)]), 350);
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex-1 space-y-3">
        {msgs.length === 0 && (
          <div>
            <p className="text-[0.8rem] text-offwhite/55">
              Ask anything about this call. Answers cite the exact moment in the recording.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-full border border-white/15 px-3 py-1.5 text-[0.72rem] text-offwhite/70 transition hover:border-brand-cyan hover:text-brand-cyan">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`rounded-xl p-3 text-[0.8rem] leading-relaxed ${m.role === "user" ? "ml-6 bg-white/6 text-offwhite" : "mr-2 bg-brand-cyan/10 text-offwhite/85"}`}>
            {m.text}
            {m.cites && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.cites.map((c) => (
                  <button key={c.at} onClick={() => onSeek(c.at)} className="rounded-full bg-black/30 px-2.5 py-1 text-[0.66rem] text-brand-cyan hover:bg-black/50">
                    ▶ {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Fanthom about this call…"
          className="flex-1 rounded-xl border border-white/15 bg-[#131316] px-3.5 py-2.5 text-[0.8rem] outline-none transition focus:border-brand-cyan"
        />
        <button type="submit" className="rounded-xl bg-brand-cyan px-4 text-[0.85rem] font-medium text-black">Ask</button>
      </form>
      <p className="mt-2 text-[0.62rem] text-offwhite/35">
        Demo build: retrieval is keyword-scored against the transcript with cited moments, no LLM behind it.
      </p>
    </div>
  );
}
