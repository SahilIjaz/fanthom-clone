# Fanthom — a working rebuild of fathom.video / fathom.ai

24-hour assignment build. Live at **https://fanthom-clone-ecru.vercel.app** · repo public, `.agent-logs/` committed.

## What this is

Two surfaces, one Next.js 16 app:

- **Marketing site** (`/`, `/pricing`) — rebuild of fathom.ai's homepage and pricing pages: hero, capture carousel, teams/individuals tabs, integrations map, role carousel, stats, full feature matrix with plan toggles (individuals/teams, monthly/annual).
- **The product** (`/app`) — the part that actually matters:
  - **Meeting library** grouped by day, with external/internal filters and inline filtering.
  - **Call page** — synthetic playback (speaker tiles light up per transcript segment, scrubbable waveform, keyboard shortcuts), transcript synced to the clock with click-to-seek and per-call search, AI summary with **template switching** (Chronological / BANT / actions-only), **action items** that link to the second they were said and persist toggles, **highlights**, and **Ask Fanthom** with citations that jump playback.
  - **Global search** across every transcript with moment-level deep links.
  - **Share links** that open for signed-out visitors, and **clip links** that scope playback to a range — stateless tokens, shareable with someone who was never on the call.
  - **Team workspace** — recordings + open action items across the team.
  - **Simulated bot-free capture** flow (`/app/live`).

## Scope calls (the honest part)

- **The recording bot is faked.** The brief explicitly allows it. Playback is a synthetic renderer driven by transcript timing at 8× so an hour-long call demos in minutes. Time went into the post-call experience instead, because that is where Fathom lives or dies.
- **Ask Fanthom has no LLM behind it.** It keyword-scores transcript segments and answers with citations. The UI contract (answer + jump-to-moment) is the real one; the model behind it is swappable. The panel says so in the footer.
- **Auth is a demo cookie.** Any email enters a seeded workspace. OAuth wiring is table stakes and tells you nothing about the product.
- **Seed data is the deliverable.** Six meetings, including the case the brief says matters: a **67-minute, 9-person QBR** with regional deep-dives, a security Q&A, and commercial negotiation — action items, highlights, and per-template summaries all authored against it.
- Mutations (action-item toggles, custom highlights) persist in `localStorage`; the deploy is fully stateless, so share links survive any instance.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
node seed/generate.mjs   # regenerate src/data/meetings.json
```

## Agent capture

`.claude/settings.json` wires Claude Code's `UserPromptSubmit` and `Stop` hooks to `.claude/hooks/capture.py`, which appends prompt/response pairs per session to `.agent-logs/`. See `CAPTURE-TEST.md` for the canary proof and what failed first.
