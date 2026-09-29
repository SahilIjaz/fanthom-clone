# CAPTURE-TEST

## Tool and model

- Tool: Claude Code 2.0.37 (VS Code extension).
- Model: claude-fable-5-1 does both planning and execution. The two canary sessions were headless `claude -p` runs that used Claude Code's default model at the time (claude-sonnet-4-5-20250929). The model of every turn is read from the session transcript and recorded in each RESPONSE entry, so any switch during the build is visible.
- Mechanism: Claude Code lifecycle hooks. UserPromptSubmit gets the prompt on stdin, Stop gets the transcript path on stdin. Both fire on their own.

## Config

- Changed: `.claude/settings.json` (project scope, committed).
- Script: `.claude/hooks/capture.py`. Prompt event appends a PROMPT entry; Stop event reads the transcript, extracts the final assistant text of the turn (no thinking, no tool calls, no intermediate steps) and appends a RESPONSE entry with the model name. One file per session in `.agent-logs/`, 8x format, append-only.

## Where the canaries landed

- Canary 1: `.agent-logs/2026-09-29_01-03-09_fea59955-935c-461b-80dd-22997a398ede.md`
- Canary 2 (separate process, fresh session): `.agent-logs/2026-09-29_01-09-44_e229b087-0e6c-441e-919a-7c01523830c4.md`

## Canary 1, raw

```
[LOG_ENTRY type=PROMPT num=1 session=fea59955]
timestamp: 2026-09-29T01:03:09.763Z
model: claude-fable-5-1

CAPTURE TEST — 8x assignment, Sahil Ijaz


[LOG_ENTRY type=RESPONSE num=1 session=fea59955]
timestamp: 2026-09-29T01:03:14.002Z
model: claude-sonnet-4-5-20250929

I can see you're starting a capture test session. How can I help you with this assignment, Sahil?

```

## Canary 2, raw

```
[LOG_ENTRY type=PROMPT num=1 session=e229b087]
timestamp: 2026-09-29T01:09:44.160Z
model: unknown-until-first-response

CAPTURE TEST — 8x assignment, Sahil Ijaz


[LOG_ENTRY type=RESPONSE num=1 session=e229b087]
timestamp: 2026-09-29T01:09:49.996Z
model: claude-sonnet-4-5-20250929

I can see you've mentioned "CAPTURE TEST — 8x assignment, Sahil Ijaz". 

Could you please provide more details about what you'd like me to help you with? For example:
- Are you working on a test assignment that needs to be completed?
- Do you need help setting up or running tests?
- Is there code that needs to be written or debugged?
- Are you looking to understand how something works in the codebase?

Let me know what you need assistance with, and I'll be happy to help!

```

## Things that did not work first

- The session that installed the hook cannot be captured by the hook, because hooks load at session start and this session began in the parent folder before the repo existed. Its turns are backfilled from its transcript with the same parser (`capture.py backfill`), into the log file for session 1791c116. Every later session in this folder is captured by the hook directly.
- The first version of the script guessed the model at prompt time (the prompt payload has no model). Canary 1 ran on Sonnet, so its PROMPT entry says Fable and its RESPONSE entry says Sonnet. The entry is left as written; the script now reads the model from the transcript or says `unknown-until-first-response`.
- macOS has no `timeout` command, so the first canary attempt failed before Claude started.
- Running the second canary with `--model claude-fable-5-1` hung for over four minutes and was killed. Re-run with the default model, it returned in six seconds.
